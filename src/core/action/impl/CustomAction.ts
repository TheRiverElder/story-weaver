import { PlayerEntity } from "../../entity/PlayerEntity";
import Action from "../Action";
import { Consumer } from "../../BasicTypes";

export interface CustomActionData {
    text?: string;
    act?: Consumer<PlayerEntity>;
    labels?: Array<string>;
}

const NOP: any = () => {};

export default class CustomAction implements Action { 

    public readonly text: string;
    public readonly actCallback: Consumer<PlayerEntity>;
    public readonly labels: Array<string>;

    constructor(data: CustomActionData) {
        this.text = data.text || "";
        this.actCallback = data.act || NOP;
        this.labels = data.labels || [];
    }

    getText(): string {
        return this.text;
    }

    act(player: PlayerEntity): void {
        this.actCallback(player);
    }
    
    getLabels(): string[] {
        return this.labels;
    }

}