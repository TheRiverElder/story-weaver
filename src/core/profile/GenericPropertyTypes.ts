import { PropertyType } from "./PropertyType";


export const PROPERTY_TYPE_HEALTH = new PropertyType("health", "生命", 0);
export const PROPERTY_TYPE_ATTACK = new PropertyType("attack", "攻击力", 0);
export const PROPERTY_TYPE_DEFENSE = new PropertyType("defense", "防御力", 0);
export const PROPERTY_TYPE_DEXTERITY = new PropertyType("dexterity", "敏捷", 50);
export const PROPERTY_TYPE_STRENGTH = new PropertyType("strength", "体力", 50);

export const PROPERTY_TYPE_WATCH = new PropertyType("watch", "观察", 20);
export const PROPERTY_TYPE_LISTEN = new PropertyType("listen", "听", 20);
export const PROPERTY_TYPE_MEDICINE = new PropertyType("medicine", "药学", 1);