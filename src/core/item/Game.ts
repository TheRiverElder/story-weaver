import Action from "../action/Action";
import ActionGroup from "../action/ActionGroup";
import GameObject from "../action/GameObject";
import { GameInitializer } from "../common";
import { PlayerEntity } from "../entity/PlayerEntity";
import { Interaction } from "../interaction/Interaction";
import { MessageType, MESSAGE_TYPE_COLLAPSE, MESSAGE_TYPE_NORMAL, MESSAGE_TYPE_REPLACEABLE } from "../message/MessageTypes";
import { Generator } from "../BasicTypes";
import Site from "../structure/Site";
import Registry from "../util/Registry";

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

export class Game implements GameObject {

    public readonly uidGenerator: Generator<number>;
    public readonly gameInitializer: GameInitializer;
    public readonly sites = new Registry<string, Site>(s => s.id);
    public adventurer: PlayerEntity = {} as PlayerEntity;
    public gameObjects: GameObject[] = [];
    public messages: Message[] = [];

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

        for (const site of this.sites.getAll()) {
            const adventurer = site.entities.find(it => it instanceof PlayerEntity);
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

    getActionGroups(actor: PlayerEntity): ActionGroup[] {
        if (this.gameObjects.length > 0) return this.gameObjects[this.gameObjects.length - 1].getActionGroups(actor);

        const adventurerActionGroups = this.adventurer.site?.getActionGroups();
        return adventurerActionGroups || [];
    }

    executeAction(action: Action, actor: PlayerEntity = this.adventurer) {
        action.act(actor);
        // for (const room of this.sites.getAll()) {
        //     for (const entity of room.entities.values()) {
        //         // entity.onActed(actor, action);
        //     }
        // }
        this.notifyUpdate();
    }

    notifyUpdate() {
        // console.log("notifyUpdate");
        this.updateListeners.forEach(it => it(this));
    }

    appendInteravtiveGroup(gameObject: GameObject) {
        this.gameObjects.push(gameObject);
        this.notifyUpdate();
    }

    replaceInteravtiveGroup(gameObject: GameObject) {
        this.gameObjects.pop();
        this.gameObjects.push(gameObject);
        this.notifyUpdate();
    }

    removeInteravtiveGroup(gameObject: GameObject) {
        this.gameObjects = this.gameObjects.filter(e => e !== gameObject);
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
                this.messages.push(currentMessage);
            }
        } else {
            this.messages.push(currentMessage);
        }

    }

    appendMessageText(text: string, type: MessageType = MESSAGE_TYPE_NORMAL) {
        this.appendMessage({ text, type, timestamp: new Date() });
    }

    // 发布一条互动，返回是否执行成功
    interact(interaction: Interaction): boolean {
        const { media, skill, target } = interaction;

        if (!target.canReceiveInteraction(interaction)) return false;

        media.onApplyInteraction(interaction);
        skill.onPassInteraction(interaction);
        target.onReceiveInteraction(interaction);

        return true;
    }
}