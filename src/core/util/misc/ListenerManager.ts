export default class ListenerManager<TEvent = void> {

    public static disposer(...dispose: Array<() => any>): () => void {
        return () => dispose.forEach(disposeFunction => disposeFunction());
    }

    private listeners = new Set<Listener<TEvent>>();

    add(listener: Listener<TEvent>): () => void {
        this.listeners.add(listener);
        return () => this.remove(listener);
    }

    remove(listener: Listener<TEvent>) {
        this.listeners.delete(listener);
    }

    emit(event: TEvent) {
        this.listeners.forEach((listener) => listener(event))
    }
}

export type Listener<TEvent = void> = (event: TEvent) => void;