import HandComponent from "../entity/HandComponent";
import GameObject from "./GameObject";
import HostedComponentBase from "./HostedComponentBase";

export default class Item extends GameObject<HostedComponentBase<Item>> {


    public onHold(hand: HandComponent, handIndex: number): void {
        // TODO: Implement item logic when held by a hand
    }

    public onRelease(hand: HandComponent, handIndex: number): void {
        // TODO: Implement item logic when released from a hand
    }
}