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

    private readonly title: string;
    private readonly description: string;
    private readonly actions: Array<Action>;
    private readonly labels: Array<string>;
    private readonly target: InteractionTarget;

    constructor(data: CustomActionGroupData) {
        this.title = data.title || "";
        this.description = data.description || "";
        this.actions = data.actions || [];
        this.labels = data.labels || [];
        this.target = data.target || INTERACTION_TARGET_EMPTY;
    }

    getTitle(): string {
        return this.title;
    }
    
    getDescription(): string {
        return this.description;
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