import { Buff } from "../buff/Buff";
import { BuffSet } from "../buff/BuffSet";
import { EntityData, Entity } from "./Entity";
import { InventorySlot } from "../inventory/InventorySlot";
import { LivingEntityInventory, SLOT_TYPE_WEAPON, SLOT_TYPE_ARMOR } from "../inventory/LivingEntityInventory";
import { Item } from "../item/Item";
import { GenericProfile } from "../profile/GenericProfile";
import { Profile } from "../profile/Profile";
import { ProfileEffector } from "../profile/ProfileEffector";
import { PropertyType } from "../profile/PropertyType";
import { PROPERTY_TYPE_HEALTH, PROPERTY_TYPE_ATTACK, PROPERTY_TYPE_DEFENSE, PROPERTY_TYPE_DEXTERITY } from "../profile/PropertyTypes";
import { FightingTask, FightingActionType } from "../task/FightingTask";
import { filterNotNull } from "../util/lang";
import { ItemEntity } from "./ItemEntity";
import { SimpleEntity } from "./SimpleEntity";
import { GenericInteractionBehavior } from "../interaction/GenericInteractionBehavior";
import { InteractionBehaviorItemCreators } from "../interaction/item/InteractionBehaviorItemCreators";
import { Interaction, InteractionTarget } from "../interaction/Interaction";
import { PlayerEntity } from "./PlayerEntity";
import Action from "../action/Action";
import ActionGroup from "../action/ActionGroup";
import CustomAction from "../action/impl/CustomAction";

// alert("FUCK from LivingEntity");


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
    buffs?: Buff[]; 
}

export abstract class LivingEntity extends Entity implements ActionGroup {

    public readonly inventory: LivingEntityInventory;
    public readonly profile = new GenericProfile();
    public readonly tags = new Set<string>();
    public readonly buffs = new BuffSet();

    get alive(): boolean { return this.health > 0; }

    get health(): number { return this.profile.getProperty(PROPERTY_TYPE_HEALTH); }
    set health(value: number) { this.profile.setProperty(PROPERTY_TYPE_HEALTH, value); }

    get maxHealth(): number { return this.profile.getPropertyRange(PROPERTY_TYPE_HEALTH)[1]; }
    set maxHealth(value: number) { this.profile.setPropertyRange(PROPERTY_TYPE_HEALTH, [0, value]); }

    get attackPower(): number { return this.getProperty(PROPERTY_TYPE_ATTACK); }
    set attackPower(value: number) { this.profile.setProperty(PROPERTY_TYPE_ATTACK, value); }

    get defensePower(): number {return this.getProperty(PROPERTY_TYPE_DEFENSE); }
    set defensePower(value: number) {this.profile.setProperty(PROPERTY_TYPE_DEFENSE, value); }

    get dexterity(): number { return this.getProperty(PROPERTY_TYPE_DEXTERITY); }
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
        this.inventory.getSpecialSlot(SLOT_TYPE_WEAPON)?.set(data.weapon || null, true);
        this.inventory.getSpecialSlot(SLOT_TYPE_ARMOR)?.set(data.armor || null, true);
        this.inventory.listeners.add(this.onInventoryChanged.bind(this));

        data.tags?.forEach(tag => this.tags.add(tag));
        data.buffs?.forEach(buff => this.buffs.add(buff));
    }

    getActionGroups(actor: PlayerEntity): ActionGroup[] {
        if (actor.uid === this.uid) return [];
        else return [this];
    }

    // 获取该实体的一段简短描述，例如名字、血量、物品类型等
    get brief() {
        return `【生物】${this.name}（${this.health}/${this.maxHealth}）`;
    }
    
    getTitle(): string {
        return this.name;
    }

    getDescription(): string {
        return this.brief;
    }

    getActions(): Action[] {
        return [new CustomAction({
            text: '攻击',
            labels: ['attack'],
            act: (actor) => {
                const fighting = new FightingTask(this.game, [actor, this]);
                this.game.appendInteravtiveGroup(fighting);
                fighting.continueRound();
            },
        })];
    }

    getLabels(): string[] {
        return ["living-entity"];
    }

    getTarget(): InteractionTarget {
        return this.interactionBehavior;
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
        const corpse = this.createCorpse(reason);   
        if (corpse && this.room) {
            this.room.addEntity(corpse);
        }      
    }

    createCorpse(reason?: string): Entity | null {
        return new SimpleEntity({
            game: this.game,
            name: `${this.name}的尸体`,
            brief: `这是${this.name}的尸体`,
            interactionBehavior: new GenericInteractionBehavior({
                game: this.game,
                maxCounter: 5,
                items: [
                    ...this.inventory.getIndexedSlots(), 
                    ...this.inventory.getSpecialSlots(),
                ].map(slot => slot.get())
                .filter(item => !!item)
                .map(item => InteractionBehaviorItemCreators.item(item!!)),
            }),
        });
    }

    getProperty(type: PropertyType): number {
        return this.getEffectors(type).reduce((value, effector) => effector.effect(value, type, this.profile), this.profile.getProperty(type));
    }

    getEffectors(type: PropertyType): ProfileEffector[] {
        return [
            ...this.getIdenticalEffectors(type),
            ...this.buffs.values(),
        ];
    }

    getIdenticalEffectors(type: PropertyType): ProfileEffector[] {
        switch (type) {
            case PROPERTY_TYPE_ATTACK: return filterNotNull([this.inventory.getSpecialSlot(SLOT_TYPE_WEAPON)?.item]);
            case PROPERTY_TYPE_DEFENSE: return filterNotNull([this.inventory.getSpecialSlot(SLOT_TYPE_ARMOR)?.item]);
            default: return [];
        }
    }

    canInteract() {
        return true;
    }

    onReceiveInteraction({ actor, skill }: Interaction) {
        if (skill === PROPERTY_TYPE_ATTACK) {
            this.game.appendInteravtiveGroup(new FightingTask(this.game, [actor, this]));
        }
    }
}