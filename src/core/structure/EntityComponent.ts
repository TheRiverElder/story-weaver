import Action from "../action/Action";
import Entity from "./Entity";
import HostedComponentBase from "./HostedComponentBase";

export default class EntityComponent extends HostedComponentBase<Entity> {

    public modifyTitle(title: string): string {
        return title;   
    }

    public modifyDescriptions(descriptions: Array<string>): Array<string> {
        return descriptions;
    }

    public modifyActions(actions: Array<Action>): Array<Action> {
        return actions;
    }
}