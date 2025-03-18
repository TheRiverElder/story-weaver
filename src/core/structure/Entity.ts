import Action from "../action/Action";
import ActionGroup from "../action/ActionGroup";
import ModifierManager from "../util/misc/ModifierManager";
import EntityComponent from "./EntityComponent";
import GameObject, { GameObjectProps } from "./GameObject";
import Site from "./Site";

export interface EntityProps extends GameObjectProps<EntityComponent> {
    name?: string;
    descriptions?: Array<string>;
}

export interface EntityModifiers {
    readonly title: ModifierManager<string>;
    readonly descriptions: ModifierManager<Array<string>>;
    readonly actions: ModifierManager<Array<Action>>;
}

export default class Entity extends GameObject<EntityComponent> {

    public name: string;
    private basicDescriptions: Array<string>;

    private _site?: Site;
    public get site(): Site {
        if (!this._site) throw new Error('Entity has no site');
        return this._site;
    }
    // 强制设置，并不会对相关的实体进行任何检查
    public set site(site: Site | undefined) {
        this._site = site;
    }

    constructor(props: EntityProps) {
        super(props);
        this.name = props.name || '???';
        this.basicDescriptions = props.descriptions || [];

        this.activate();
    }

    public readonly modifiers: EntityModifiers = Object.freeze({
        title: new ModifierManager<string>(),
        descriptions: new ModifierManager<Array<string>>(),
        actions: new ModifierManager<Array<Action>>(),
    });

    public get originDescriptions(): Array<string> {
        return this.basicDescriptions;
    }

    public get originActions(): Array<Action> {
        return [];
    }


    public get title() {
        return this.modifiers.title.modify(this.name);
    }

    public get descriptions() {
        return this.modifiers.descriptions.modify(this.originDescriptions);
    }

    public get actions() {
        return this.modifiers.actions.modify(this.originActions);
    }

    public teleport(site: Site): void {
        if (this._site) this._site.removeEntity(this);
        site.addEntity(this);
        this.site = site;
    }

    public getActionGroup(): ActionGroup {

        return {
            title: this.title,
            descriptions: this.descriptions,
            actions: this.actions,
            labels: [],
        };
    }
}