import { Action, ActionGroup, ActionParams } from "../common";
import { Entity, EntityData } from "../Entity";
import { LivingEntityInventory } from "../inventory/LivingEntityInventory";
import { Item } from "../Item";
import { GenericProfile } from "../profile/GenericProfile";
import { PropertyType } from "../profile/PropertyType";
import { ItemEntity } from "./ItemEntity";

export interface LivingEntityData extends EntityData {
    health: number;
    maxHealth: number;
    attackPower: number;
    defensePower: number;
    dexterity: number;
    weapon?: Item;
    armor?: Item;
    items?: Item[]; 
}

export const PROPERTY_TYPE_HEALTH = new PropertyType("health", "生命", 0);
export const PROPERTY_TYPE_ATTACK = new PropertyType("attack", "攻击力", 0);
export const PROPERTY_TYPE_DEFENSE = new PropertyType("defense", "防御力", 0);
export const PROPERTY_TYPE_DEXTERITY = new PropertyType("dexterity", "敏捷", 50);

export abstract class LivingEntity extends Entity {

    public readonly inventory = new LivingEntityInventory(this);
    public readonly profile = new GenericProfile();

    get health(): number { return this.profile.getProperty(PROPERTY_TYPE_HEALTH); }
    set health(value: number) { this.profile.setProperty(PROPERTY_TYPE_HEALTH, value); }

    get maxHealth(): number { return this.profile.getPropertyRange(PROPERTY_TYPE_HEALTH)[1]; }
    set maxHealth(value: number) { this.profile.setPropertyRange(PROPERTY_TYPE_HEALTH, [0, value]); }

    get attackPower(): number { return this.profile.getProperty(PROPERTY_TYPE_ATTACK); }
    set attackPower(value: number) { this.profile.setProperty(PROPERTY_TYPE_ATTACK, value); }

    get defensePower(): number {return this.profile.getProperty(PROPERTY_TYPE_DEFENSE); }
    set defensePower(value: number) {this.profile.setProperty(PROPERTY_TYPE_DEFENSE, value); }

    get dexterity(): number { return this.profile.getProperty(PROPERTY_TYPE_DEXTERITY); }
    set dexterity(value: number) { this.profile.setProperty(PROPERTY_TYPE_DEXTERITY, value); }

    get weapon(): Item | null { return this.inventory.weaponSlot.item; };
    set weapon(item: Item | null) { this.inventory.weaponSlot.item = item; };

    get armor(): Item | null { return this.inventory.armorSlot.item; };
    set armor(item: Item | null) { this.inventory.armorSlot.item = item; };

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
        if (data.items) {
            data.items.forEach(item => this.inventory.add(item));
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
        this.unequipArmor();
        this.armor = item;
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
        return this.inventory.add(item);
    }

    appendOrDropItem(item: Item) {
        if (!this.appendItem(item)) {
            if (this.room !== null) {
                this.room.addEntity(new ItemEntity({ uid: item.uid, item}));
            }
        }
    }

}