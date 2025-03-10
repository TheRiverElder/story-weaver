import Action from "../action/Action";
import ActionGroup from "../action/ActionGroup";
import { PlayerEntity } from "../entity/PlayerEntity";
import ModifierManager from "../util/misc/ModifierManager";
import EntityComponent from "./EntityComponent";
import GameObject from "./GameObject";
import Site from "./Site";

export type EntityProps = {
    name?: string;
    components?: Array<EntityComponent>;
};

export default class Entity extends GameObject<EntityComponent> {
    
    public name: string;

    private _site?: Site; 
    public get site() { 
        if (!this._site) throw new Error('Entity has no site');
        return this._site; 
    }
    // 强制设置，并不会对相关的实体进行任何检查
    public set site(site: Site | undefined) {
        this._site = site;
    }

    constructor(options: EntityProps) {
        super(options);
        this.name = options.name || '???';
    }

    public readonly modifiers = {
        title: new ModifierManager<string>(),
        descriptions: new ModifierManager<Array<string>>(),
        actions: new ModifierManager<Array<Action>>(),
    };

    public teleport(site: Site): void {
        if (this._site) this._site.removeEntity(this);
        site.addEntity(this);
        this.site = site;
    }

    public getActionGroup(player: PlayerEntity): ActionGroup {

        const title = this.modifiers.title.modify(this.name);
        const descriptions = this.modifiers.descriptions.modify([]);
        const actions = this.modifiers.actions.modify([]);

        return {
            title,
            descriptions,
            actions,
            labels: [],
        };
    }
}