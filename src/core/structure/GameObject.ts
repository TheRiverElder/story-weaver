import ComponentManager from "../util/misc/ComponentManager";
import HostedComponentBase from "./HostedComponentBase";

export type GameObjectProps<TComponent> = {
    components?: Array<TComponent>;
};

export default class GameObject<TComponent extends HostedComponentBase<GameObject<TComponent>>> {

    constructor({ components }: GameObjectProps<TComponent>) {
        if (components && components.length > 0) {
            this.components.listeners.ADD.add(c => c.onAddToHost(this));
            this.components.listeners.REMOVE.add(c => c.onRemoveFromHost());
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