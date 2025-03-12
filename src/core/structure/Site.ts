import { Game } from "../item/Game";
import Entity from "./Entity";

export type SiteProps = {
    game: Game;
    id: string;
    name: string;
    entities: Array<Entity>;
};

export default class Site {

    public readonly game: Game;
    public readonly id: string;
    public name: string;

    private _entities: Array<Entity>;
    public get entities(): Array<Entity> {
        return this._entities.slice();
    }


    constructor(props: SiteProps) {
        this.game = props.game;
        this.id = props.id;
        this.name = props.name;
        this._entities = [...props.entities];
        this._entities.forEach(entity => entity.site = this);
    }

    /**
     * 单纯地将实体添加到站点中，不进行任何检查
     * 若要移动一个实体到一个站点，请使用 `Entity#teleport(Site)` 方法
     */
    public addEntity(entity: Entity): void {
        if (this._entities.includes(entity)) return;
        this._entities.push(entity);
    }

    /**
     * 单纯地将实体从站点中移除，不进行任何检查
     * 若要移动一个实体到另一个站点，请使用 `Entity#teleport(Site)` 方法
     */
    public removeEntity(entity: Entity): boolean {
        const index = this._entities.indexOf(entity);
        if (index === -1) return false;
        this._entities.splice(index, 1);
        return true;
    }

}