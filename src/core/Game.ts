import { Action, InteractiveGroup, Generator, Terrian, ActionParams, TerrianGenerator, ActionGroup } from "./common";
import { LivingEntity } from "./entity/LivingEntity";
import { PlayerEntity } from "./entity/PlayerEntity";
import { Room } from "./Room";
import { UniqueSet } from "./UniqueSet";

export interface GameData {
    uidGenerator: Generator<number>;
    terrianGenerator: TerrianGenerator;
}

export type GameUpdateListener = (game: Game) => void;

export class Game implements InteractiveGroup {

    uidGenerator: Generator<number>;
    terrianGenerator: TerrianGenerator;
    rooms: UniqueSet<Room> = new UniqueSet();
    adventurer: PlayerEntity = {} as PlayerEntity;
    interactiveGroups: InteractiveGroup[] = [];
    messages: string[] = [];

    level: number = 1; // 当前关卡数

    public updateListeners: Set<GameUpdateListener> = new Set();
    public gameOverListeners: Set<GameUpdateListener> = new Set();

    constructor(data: GameData) {
        this.uidGenerator = data.uidGenerator;
        this.terrianGenerator = data.terrianGenerator;
    }

    // 初始化当前关卡
    initialize(): boolean {
        const adventurers: PlayerEntity[] = [];

        const terrian: Terrian = this.terrianGenerator.generate(this);
        
        for (const room of terrian.rooms) {
            this.rooms.add(room);
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


    runAttack(source: LivingEntity, target: LivingEntity) {
        if (source.dexterity >= target.dexterity) {
            this.runSingleAttack(source, target) && this.runSingleAttack(target, source);
        } else {
            this.runSingleAttack(target, source) && this.runSingleAttack(source, target);
        }
    }

    // 返回该战斗是否继续
    runSingleAttack(source: LivingEntity, target: LivingEntity): boolean {
        this.appendMessage(`⚔ ${source.name} 攻击了 ${target.name}`);
        if (Math.random() < target.dexterity / 100) {
            this.appendMessage(`${target.name}躲过了${source.name}的攻击`);
        } else {
            const damage = Math.max(0, source.attackPower - target.defensePower);
            this.appendMessage(`${source.name}造成${source.attackPower} - ${target.defensePower} = ${damage} 伤害`);
            target.mutateHealth(-damage);
        }
        return target.health > 0;
    }



    getActionGroups(params: ActionParams): ActionGroup[] {
        if (this.interactiveGroups.length > 0) return this.interactiveGroups[this.interactiveGroups.length - 1].getActionGroups(params);
        const adventurerActionGroups = this.adventurer.room?.getActionGroups(params);
        return adventurerActionGroups || [];
    }

    runAction(action: Action, actor: PlayerEntity = this.adventurer) {
        action.act({ game: this, actor });
        this.notifyUpdate();
    }

    notifyUpdate() {
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

    appendMessage(message: string) {
        this.messages.push(message);
        this.notifyUpdate();
    }
}