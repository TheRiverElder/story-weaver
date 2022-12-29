import { FightingPropertyType } from "./FightingPropertyType";
import { InvestigationPropertyType } from "./InvestigationPropertyType";
import { PropertyType } from "./PropertyType";


export const PROPERTY_TYPE_HEALTH = new PropertyType("health", "生命", 0);
export const PROPERTY_TYPE_ATTACK = new FightingPropertyType("attack", "攻击", 0);
export const PROPERTY_TYPE_DEFENSE = new FightingPropertyType("defense", "防御", 0);
export const PROPERTY_TYPE_DEXTERITY = new PropertyType("dexterity", "敏捷", 50);
export const PROPERTY_TYPE_STRENGTH = new PropertyType("strength", "体力", 50);

export const PROPERTY_TYPE_WATCH = new InvestigationPropertyType("watch", "观察", 20);
export const PROPERTY_TYPE_LISTEN = new InvestigationPropertyType("listen", "听", 20);
export const PROPERTY_TYPE_MEDICINE = new InvestigationPropertyType("medicine", "药学", 1);