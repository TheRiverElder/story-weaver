import { Action, ActionGroup, ActionParams } from "../common";
import { Entity, EntityData } from "../Entity";
import { Inventory } from "../inventory/Inventory";
import { InventorySlot, SLOT_TYPE_INDEXED } from "../inventory/InventorySlot";
import { InventorySlotType } from "../inventory/InventorySlotType";
import { LivingEntityInventory } from "../inventory/LivingEntityInventory";
import { Item } from "../Item";
import { GenericProfile } from "../profile/GenericProfile";
import { Profile } from "../profile/Profile";
import { PropertyType } from "../profile/PropertyType";
import { FightingActionType, FightingTask } from "../task/FightingTask";
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
    tags?: string[]; 
}

export const PROPERTY_TYPE_HEALTH = new PropertyType("health", "生命", 0);
export const PROPERTY_TYPE_ATTACK = new PropertyType("attack", "攻击力", 0);
export const PROPERTY_TYPE_DEFENSE = new PropertyType("defense", "防御力", 0);
export const PROPERTY_TYPE_DEXTERITY = new PropertyType("dexterity", "敏捷", 50);
export const PROPERTY_TYPE_STRENGTH = new PropertyType("strength", "体力", 50);

export abstract class LivingEntity extends Entity {

    public readonly inventory: LivingEntityInventory;
    public readonly profile = new GenericProfile();
    public readonly tags = new Set<string>();

    get alive(): boolean { return this.health > 0; }

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
        
        this.profile.listeners.add(this.onPropertyChanged.bind(this));

        this.inventory = new LivingEntityInventory(this, data.items);
        
        if (data.weapon) {
            this.equipWeapon(data.weapon);
        }
        if (data.armor) {
            this.equipArmor(data.armor);
        }
        if (data.items) {
            data.items.forEach(item => this.inventory.addItem(item));
        }
        if (data.tags) {
            data.tags.forEach(tag => this.tags.add(tag));
        }
        
        this.inventory.listeners.add(this.onInventoryChanged.bind(this));
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
        if (this.inventory.findIndexedSlotWithItem(item)) return true;
        return this.inventory.addItem(item);
    }

    appendOrDropItem(item: Item) {
        if (!this.appendItem(item)) {
            if (this.room !== null) {
                this.room.addEntity(new ItemEntity({ item }));
            }
        }
    }

    onFightTurn(fighting: FightingTask): FightingActionType {
        return FightingActionType.SKIP;
    }

    onFightEscape(entity: LivingEntity, fighting: FightingTask): FightingActionType {
        return FightingActionType.SKIP;
    }

    onPropertyChanged(type: PropertyType, currentValue: number, previousValue: number, profile: Profile) {
        if (type === PROPERTY_TYPE_HEALTH) {
            if (currentValue <= 0) {
                this.die();
            }
        }
    }

    onInventoryChanged(slot: InventorySlot, previousItem: Item | null) {
        
    }

    die(reason?: string) {
        this.game.appendMessage(`💀${this.name}死亡` + (reason ? `，死因：${reason}！` : "！"));
        this.onDied(reason);
        this.remove();
    }

    onDied(reason?: string) {
        
    }
}