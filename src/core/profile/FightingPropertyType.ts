import { LivingEntity } from "../entity/LivingEntity";
import { Interaction } from "../Interaction";
import { FightingTask } from "../task/FightingTask";
import { PropertyType } from "./PropertyType";

export class FightingPropertyType extends PropertyType {
    onInteract({ actor, target }: Interaction): void {
        if (target instanceof LivingEntity) {
            actor.game.appendInteravtiveGroup(new FightingTask(actor.game, [actor, target]));
        }
    }
}