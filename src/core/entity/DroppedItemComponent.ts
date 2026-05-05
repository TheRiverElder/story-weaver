import Action from "../action/Action";
import { Item } from "../item/Item";
import Entity from "../structure/Entity";
import EntityComponent from "../structure/EntityComponent";
import { composeFunctions } from "../util/misc/ModifierManager";
import { PlayerEntity } from "./PlayerEntity";

export interface DroppedItemComponentProps {
    readonly item: Item;
    readonly destroyOnPickup?: boolean;
}

export default class DroppedItemComponent extends EntityComponent {

    public item: Item | null = null;
    public readonly destroyOnPickup: boolean;

    constructor(props: DroppedItemComponentProps) {
        super();
        this.item = props.item;
        this.destroyOnPickup = props.destroyOnPickup ?? true; // convert to bool
    }

    private dispose?: Function;

    public onActivate(): void {
        const host = this.host;

        const item = this.item;
        if (!item) return;

        this.dispose = composeFunctions(
            host.modifiers.title.add(() => `${item.name}`),
            host.modifiers.actions.add((previousValue: Array<Action>) => previousValue.concat([
                {
                    text: "Pick up",
                    labels: ["item"],
                    act: (player: PlayerEntity) => {
                        if (!player.inventory.add(item)) return;
                        this.item = null;
                        if (this.destroyOnPickup) {
                            this.host.removeFromSite();
                        }
                    },
                },
            ]))
        );
    }

    public onRemoveFromHost(): void {
        this.dispose?.();
        this.dispose = undefined;
    }

}