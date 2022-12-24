import { Id, Text } from "../BasicTypes";

export class GenericType {
    readonly id: Id;
    name: Text;

    constructor(id: Id, name: Text) {
        this.id = id;
        this.name = name;
    }
}