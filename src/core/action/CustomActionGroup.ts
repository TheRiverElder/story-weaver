import { InteractionTarget, INTERACTION_TARGET_EMPTY } from "../interaction/Interaction";
import Action from "./Action";
import ActionGroup from "./ActionGroup";

export interface CustomActionGroupData {
    title?: string;
    description?: string;
    actions?: Array<Action>;
    labels?: Array<string>;
    target?: InteractionTarget;
}

export default class CustomActionGroup implements ActionGroup {

    public readonly title: string;
    public readonly descriptions: Array<string>;
    public readonly actions: Array<Action>;
    public readonly labels: Array<string>;
    public readonly target: InteractionTarget;

    constructor(data: CustomActionGroupData) {
        this.title = data.title || "";
        this.descriptions = [data.description || ""];
        this.actions = data.actions || [];
        this.labels = data.labels || [];
        this.target = data.target || INTERACTION_TARGET_EMPTY;
    }

    getTitle(): string {
        return this.title;
    }
    
    getDescription(): string {
        return this.descriptions[0];
    }
    
    getActions(): Action[] {
        return this.actions;
    }
    
    getLabels(): string[] {
        return this.labels;
    }
    
    getTarget(): InteractionTarget {
        return this.target;
    }

}