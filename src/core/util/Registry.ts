export default class Registry<K, V> {

    private map = new Map<K, V>;

    private getKey: (v: V) => K;

    constructor(getKey: (v: V) => K) {
        this.getKey = getKey;
    }

    get(k: K): V | undefined {
        return this.map.get(k);
    }

    add(v: V, force: boolean = false): V | undefined {
        const k = this.getKey(v);

        if (!force && this.map.has(k)) {
            throw new Error(`Duplicate key ${k}`);
        }
        
        const oldV = this.map.get(k);
        this.map.set(k, v);
        return oldV;
    }

    removeByKey(k: K): boolean {
        return this.map.delete(k);
    }

    remove(v: V): boolean {
        return this.removeByKey(this.getKey(v));
    }

    clear() {
        this.map.clear();
    }

    size(): number {
        return this.map.size;
    }

    getAll(): Array<V> {
        return [...this.map.values()];
    }

    *[Symbol.iterator]() {
        for (const v of this.map.values()) {
            yield v;
        }
    }

}