import { Action, ActionGroup, ActionParams } from "../common";
import { Entity, EntityData } from "../Entity";
import { Item } from "../Item";
import { ItemEntity } from "./ItemEntity";

export interface LivingEntityData extends EntityData {
    health: number;
    maxHealth: number;
    attackPower: number;
    defensePower: number;
    dexterity: number;
    weapon?: Item;
    armor?: Item;
}

export abstract class LivingEntity extends Entity {
    health: number; // 当前生命
    maxHealth: number; // 最大生命
    attackPower: number; // 攻击力
    defensePower: number; // 防御力
    dexterity: number; // 敏捷，用于闪避等

    weapon: Item | null = null;
    armor: Item | null = null;

    constructor(data: LivingEntityData) {
        super(data);
        this.health = data.health;
        this.maxHealth = data.maxHealth;
        this.attackPower = data.attackPower;
        this.defensePower = data.defensePower;
        this.dexterity = data.dexterity;
        if (data.weapon) {
            this.equipWeapon(data.weapon);
        }
        if (data.armor) {
            this.equipArmor(data.armor);
        }
    }

    getActionGroups(params: ActionParams): ActionGroup[] {
        if (params.actor.uid === this.uid) return [];

        const attackAction: Action = {
            text: '攻击' + this.getBrief(),
            act: ({ game, actor }) => game.runAttack(actor, this),
        };
        return [{
            source: this,
            title: this.name,
            description: this.getBrief(),
            actions: [attackAction],
        }];
    }

    // 获取该实体的一段简短描述，例如名字、血量、物品类型等
    getBrief() {
        return `【生物】${this.name}（${this.health}/${this.maxHealth}）`;
    }

    equipWeapon(item: Item) {
        this.unequipWeapon();
        this.weapon = item;
        item.onEquip(this);
    }

    unequipWeapon() {
        if (this.weapon) {
            const weapon = this.weapon;
            weapon.onUnequip(this);
            this.weapon = null;
            this.appendOrDropItem(weapon);
        }
    }

    equipArmor(item: Item) {
        this.unequipWeapon();
        this.weapon = item;
        item.onEquip(this);
    }

    unequipArmor() {
        if (this.armor) {
            const armor = this.armor;
            armor.onUnequip(this);
            this.armor = null;
            this.appendOrDropItem(armor);
        }
    }

    mutateHealth(delta: number) {
        this.health = Math.max(0, Math.min(this.health + delta, this.maxHealth));
        if (this.health <= 0) {
            this.remove();
        }
    }

    appendItem(item: Item): boolean {
        return false;
    }

    appendOrDropItem(item: Item) {
        if (!this.appendItem(item)) {
            if (this.room !== null) {
                this.room.addEntity(new ItemEntity({ uid: item.uid, item}));
            }
        }
    }

}