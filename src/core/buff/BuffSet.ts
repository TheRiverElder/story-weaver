import { Buff } from "./Buff";
import { BuffType } from "./BuffType";

export class BuffSet {
    private readonly buffs = new Map<BuffType, Buff>();

    add(buff: Buff) {
        const previousBuff = this.buffs.get(buff.type);
        this.buffs.set(buff.type, previousBuff ? previousBuff.onMerge(buff) : buff);
        buff.onAdd();
    }

    restore(buff: Buff) {
        this.buffs.set(buff.type, buff);
        buff.onRestore();
    }

    remove(type: BuffType) {
        const buff = this.buffs.get(type);
        this.buffs.delete(type);
        buff?.onRemove();
    }

    update(buff: Buff) {
        this.buffs.set(buff.type, buff);
    }

    get(type: BuffType) {
        this.buffs.get(type);
    }

    values(): Buff[] {
        return Array.from(this.buffs.values());
    }
}