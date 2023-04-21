import { Interaction } from "../interaction/Interaction";
import { PropertyType } from "./PropertyType";

export class UsePropertyType extends PropertyType {
    onPassInteraction(interaction: Interaction): void {
        interaction.media?.onApplyInteraction(interaction);
    }
}