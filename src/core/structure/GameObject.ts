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
            this.components.listeners.ADD.add(c => c.bindHost(this));
            this.components.listeners.REMOVE.add(c => c.unbindHost());
            this.components.add(...components);
        }
    }
    
    // 延迟初始化组件管理器，在第一次使用时才进行初始化
    private _components?: ComponentManager<TComponent>;
    public get components() { 
        let components = this._components;
        if (components) return components;
        
        components = new ComponentManager();
        this._components = components;
        return components;
    }
    
}