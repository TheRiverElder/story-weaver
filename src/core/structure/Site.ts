import Entity from "./Entity";

export type SiteProps = {
    name: string;
    entities: Array<Entity>;
};

export default class Site {

    public name: string;

    private _entities: Array<Entity>;
    public get entities(): Array<Entity> {
        return this._entities.slice();
    }


    constructor(props: SiteProps) {
        this.name = props.name;
        this._entities = [...props.entities];
    }

    public addEntity(entity: Entity): void {
        if (this._entities.includes(entity)) return;
        this._entities.push(entity);
    }

    public removeEntity(entity: Entity): boolean {
        const index = this._entities.indexOf(entity);
        if (index === -1) return false;
        this._entities.splice(index, 1);
        return true;
    }

}