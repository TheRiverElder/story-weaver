import { Entity, EntityData } from "../Entity";

export interface SimpleEntityData extends EntityData {
    brief: string;
}

export class SimpleEntity extends Entity {
    brief: string;

    constructor(data: SimpleEntityData) {
        super(data);
        this.brief = data.brief;
    }

}
