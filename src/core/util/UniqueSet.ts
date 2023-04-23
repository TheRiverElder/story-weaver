import { Unique } from "../BasicTypes";

export class UniqueSet<T extends Unique> {
    private elements: Map<number, T> = new Map();

    constructor(elements: T[] = []) {
        elements.forEach(it => this.add(it));
    }

    add(element: T) {
        this.elements.set(element.uid, element);
    }

    getByUid(uid: number): T | null {
        return this.elements.get(uid) || null;
    }

    removeByUid(uid: number): T | null {
        const element = this.elements.get(uid) || null;
        this.elements.delete(uid);
        return element;
    }

    values(): T[] {
        return Array.from(this.elements.values());
    }

    get size() {
        return this.elements.size;
    }
} 