import type { Action, InteractiveGroup, Generator, ActionParams, GameInitializer, ActionGroup } from "./common";
import { PlayerEntity } from "./entity/PlayerEntity";
import type { Interaction } from "./Interaction";
import { MessageType, MESSAGE_TYPE_COLLAPSE, MESSAGE_TYPE_NORMAL, MESSAGE_TYPE_REPLACEABLE } from "./message/MessageTypes";
import type { Room } from "./Room";
import { UniqueSet } from "./util/UniqueSet";

// alert("FUCK from Game")

export interface GameData {
    uidGenerator: Generator<number>;
    gameInitializer: GameInitializer;
}

export interface Message {
    type: MessageType;
    timestamp: Date;
    text: string;
}

export type GameUpdateListener = (game: Game) => void;

export class Game implements InteractiveGroup {

    uidGenerator: Generator<number>;
    gameInitializer: GameInitializer;
    rooms: UniqueSet<Room> = new UniqueSet();
    adventurer: PlayerEntity = {} as PlayerEntity;
    interactiveGroups: InteractiveGroup[] = [];
    messages: Message[] = [];

    level: number = 1; // 当前关卡数

    public updateListeners: Set<GameUpdateListener> = new Set();
    public gameOverListeners: Set<GameUpdateListener> = new Set();

    constructor(data: GameData) {
        this.uidGenerator = data.uidGenerator;
        this.gameInitializer = data.gameInitializer;
    }

    // 初始化当前关卡
    initialize(): boolean {
        const adventurers: PlayerEntity[] = [];

        this.gameInitializer.initialize(this);
        
        for (const room of this.rooms.values()) {
            const adventurer = room.entities.values().find(it => it instanceof PlayerEntity);
            if (adventurer) {
                adventurers.push(adventurer as PlayerEntity);
            }
        }

        if (adventurers.length === 0) {
            alert("未找到冒险者");
            return false;
        } else if (adventurers.length > 1) {
            alert(`找到多于一个冒险者：${adventurers.length}个`);
            return false;
        } else {
            this.adventurer = adventurers[0];
            return true;
        }
    }

    getActionGroups(params: ActionParams): ActionGroup[] {
        if (this.interactiveGroups.length > 0) return this.interactiveGroups[this.interactiveGroups.length - 1].getActionGroups(params);
        
        const adventurerActionGroups = this.adventurer.room?.getActionGroups(params);
        return adventurerActionGroups || [];
    }

    runAction(action: Action, actor: PlayerEntity = this.adventurer) {
        action.act({ game: this, actor });
        for (const room of this.rooms.values()) {
            for (const entity of room.entities.values()) {
                entity.onActed(actor, action);
            }
        }
        this.notifyUpdate();
    }

    notifyUpdate() {
        // console.log("notifyUpdate");
        this.updateListeners.forEach(it => it(this));
    }

    appendInteravtiveGroup(interactiveGroup: InteractiveGroup) {
        this.interactiveGroups.push(interactiveGroup);
        this.notifyUpdate();
    }

    removeInteravtiveGroup(interactiveGroup: InteractiveGroup) {
        this.interactiveGroups = this.interactiveGroups.filter(e => e !== interactiveGroup);
        this.notifyUpdate();
    }

    appendMessage(message: Message | string) {
        const currentMessage = (typeof message === "string") ? {
            type: MESSAGE_TYPE_NORMAL,
            timestamp: new Date(),
            text: message,
        } : message;

        const lastMessageIndex = this.messages.length - 1;
        const lastMessage = this.messages[lastMessageIndex];

        if (!lastMessage) {
            this.messages.push(currentMessage);
            return;
        }

        if (lastMessage.type === MESSAGE_TYPE_REPLACEABLE) {
            this.messages.splice(lastMessageIndex, 1, currentMessage);
        } else if (lastMessage.type === MESSAGE_TYPE_COLLAPSE) {
            if (currentMessage.type === MESSAGE_TYPE_COLLAPSE) {
                lastMessage.text += "\n" + currentMessage.text;
            } else {
                currentMessage.text;
                this.messages.push(currentMessage);
            }
        } else {
            this.messages.push(currentMessage);
        }
        
    }

    appendMessageText(text: string, type: MessageType = MESSAGE_TYPE_NORMAL) {
        this.appendMessage({ text, type, timestamp: new Date() });
    }

    interact(interaction: Interaction) {
        const { skill, target } = interaction;
        if (!target.canInteract(interaction.actor, interaction.skill)) return;
        skill.onInteract(interaction);

        // media?.onApply(interaction);
        // target.onReceive(interaction);
    }
}