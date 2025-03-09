import EntityComponent from "../structure/EntityComponent";
import Item from "../structure/Item";
import { createArray } from "../util/lang";

export interface HandComponentProps {
    hands?: Array<Item | null>;
    handAmount?: number;
}

export default class HandComponent extends EntityComponent {

    public static readonly MAIN_HAND = 0;
    public static readonly SIDE_HAND = 1;

    private hands: Array<Item | null> = [null, null];

    constructor({ handAmount, hands }: HandComponentProps) {
        super();
        this.hands = createArray(handAmount ?? 2, (index) => hands ? hands[index] ?? null : null);
    }

    public getHeldItem(handIndex: number = HandComponent.MAIN_HAND): Item | null {
        return this.hands[handIndex] ?? null;
    }

    public setHeldItem(item: Item | null, handIndex: number = HandComponent.MAIN_HAND): Item | null {
        const oldItem = this.getHeldItem(handIndex);
        if (oldItem) {
            oldItem.onRelease(this, handIndex);
        }
        this.hands[handIndex] = item;
        if (item) {
            item.onHold(this, handIndex);
        }
        return oldItem;
    }

}