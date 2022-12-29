import { Interaction } from "../Interaction";
import { PropertyType } from "./PropertyType";

export class UsePropertyType extends PropertyType {
    onInteract(interaction: Interaction): void {
        interaction.media?.onUse(interaction);
    }
}