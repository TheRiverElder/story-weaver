export default class ModifierManager<T> {

    private _modifiers: Array<Modifier<T>> = [];
    public get modifiers(): Array<Modifier<T>> {
        return this._modifiers.slice();
    }

    public add(modifier: Modifier<T>, insertIndex?: number): Function | undefined {
        // check if the modifier is already present in the list
        const existingIndex = this._modifiers.findIndex((existingModifier) => existingModifier === modifier);
        if (existingIndex !== -1) return;

        // find the correct index to insert the new modifier
        if (insertIndex === undefined) {
            this._modifiers.push(modifier);
        } else {
            this._modifiers.splice(insertIndex, 0, modifier);
        }

        return () => this.remove(modifier);
    }

    public remove(modifier: Modifier<T>): void {
        // remove all occurrences of the modifier from the list
        const modifiers = this.modifiers;
        for (let i = 0; i < modifiers.length; i++) {
            if (modifiers[i] === modifier) {
                this._modifiers.splice(i, 1);
                i--;
            }
        }
    }

    public clear(): void {
        this._modifiers = [];
    }

    public modify(initialValue: T): T {
        let value = initialValue;
        for (const modifier of this._modifiers) {
            value = modifier(value);
        }
        return value;
    }


}

export type Modifier<T> = (previousValue: T) => T;