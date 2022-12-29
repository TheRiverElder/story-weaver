import { Interaction } from "../Interaction";
import { PropertyType } from "./PropertyType";

export class InvestigationPropertyType extends PropertyType {

    onInteract(interaction: Interaction): void {
        interaction.target.onInvestigate(interaction.actor, this);
    }
}