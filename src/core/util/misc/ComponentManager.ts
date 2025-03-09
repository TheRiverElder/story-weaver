import ListenerManager from './ListenerManager';

export default class ComponentManager<TComponent = any> {

    private readonly components: Array<TComponent> = [];

    public readonly listeners = Object.freeze({
        ADD: new ListenerManager<TComponent>(),
        REMOVE: new ListenerManager<TComponent>(),
    });

    public has(component: TComponent): boolean {
        return this.components.includes(component);
    }

    public add(...components: Array<TComponent>): void {
        for (const component of components) {
            if (!this.has(component)) {
                this.components.push(component);
                this.listeners.ADD.emit(component);
            }
        }
    }

    public remove(component: TComponent): void {
        const index = this.components.indexOf(component);
        if (index === -1) return;
        this.components.splice(index, 1);
        this.listeners.REMOVE.emit(component);
    }

    public clear(): void {
        const removedComponents = this.components.splice(0, this.components.length);
        for (const component of removedComponents) {
            this.listeners.REMOVE.emit(component);
        }
    }

    public get<T extends TComponent>(ctor: Constructor<T>): T | null {
        return (this.components.find((component) => component instanceof ctor) as T) ?? null;
    }

    public getOrThrow<T extends TComponent>(ctor: Constructor<T>): T {
        const component = this.components.find((component) => component instanceof ctor);
        if (!component) throw new Error(`No component of type ${ctor.name} found`);
        return (component as T);
    }

    public getAll<T extends TComponent = TComponent>(ctor?: Constructor<T>): Array<T> {
        if (!ctor) return this.components.slice() as Array<T>;

        return this.components.filter((component: TComponent) => component instanceof ctor) as Array<T>;
    }

    public removeAll(ctor: Constructor<TComponent>): void {
        let index = 0;
        while (index < this.components.length) {
            const component = this.components[index];
            if (component instanceof ctor) {
                this.components.splice(index, 1);
                this.listeners.REMOVE.emit(component);
            } else {
                index++;
            }
        }
    }

    public forEach(callbackfn: (value: TComponent) => void): void {
        for (const component of this.components) {
            callbackfn(component);
        }
    }

    public reduce<T>(callbackfn: (previousValue: T, currentValue: TComponent) => T, initialValue: T): T {
        return this.components.reduce(callbackfn, initialValue);
    }
}

export type Constructor<T> = abstract new (...args: any[]) => T;