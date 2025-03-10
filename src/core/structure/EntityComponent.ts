import { invokeAllAndClear, pushIfNotNull } from "../util/lang";
import Entity from "./Entity";
import HostedComponentBase from "./HostedComponentBase";

export default class EntityComponent extends HostedComponentBase<Entity> {

    private clearFunctions: Array<Function> = [];

    public override onAddedToHost(host: Entity): void {
        this.clearFunctions = this.onRegisterListeners().filter((f) => typeof f === "function");
    }

    public override onRemoveFromHost(): void {
        invokeAllAndClear(this.clearFunctions);
    }

    /**
     * Register listeners for this component.
     * returns an array of functions to be invoked when the component is removed from its host.
     */
    protected onRegisterListeners(): Array<Function | undefined | null> {
        return [];    
    }
}