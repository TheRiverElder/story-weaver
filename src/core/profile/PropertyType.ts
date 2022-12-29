import { Interaction } from "../Interaction";

export class PropertyType {
    public readonly id: string;
    public readonly name: string;
    public readonly defaultValue: number;

    constructor(id: string, name: string, defaultValue: number = 0) {
        this.id = id;
        this.name = name;
        this.defaultValue = defaultValue;
    }

    onInteract(interaction: Interaction): void { }
}