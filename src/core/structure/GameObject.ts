import { Game } from "../item/Game";
import ComponentManager from "../util/misc/ComponentManager";
import HostedComponentBase from "./HostedComponentBase";

export type GameObjectProps<TComponent> = {
    game: Game;
    components?: Array<TComponent>;
};

export default class GameObject<TComponent extends HostedComponentBase<GameObject<TComponent>>> {

    public readonly game: Game;

    constructor({ game, components }: GameObjectProps<TComponent>) {
        this.game = game;
        if (components && components.length > 0) {
            this.components.add(...components);
        }
    }
    
    // 延迟初始化组件管理器，在第一次使用时才进行初始化
    private _components?: ComponentManager<TComponent>;
    public get components(): ComponentManager<TComponent> { 
        if (this._components) return this._components;

        const components = new ComponentManager<TComponent>();
        components.listeners.ADD.add(c => {
            c.bindHost(this);
            if (this.active) c.onActivate();
        });
        components.listeners.REMOVE.add(c => c.unbindHost());

        this._components = components;
        return components;
    }

    private _active: boolean = false;
    public get active() { return this._active; }

    /**
     * 由于Typescript编译器的问题，所有子类的属性在super()之后会重新赋值为undefined，然后再根据声明重新复制，所以必须要手动激活组件
     */
    public activate() {
        if (this._components) {
            this._components.getAll().forEach(c => c.onActivate());
        }
    }
    
}