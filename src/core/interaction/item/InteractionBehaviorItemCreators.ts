import { Game } from "../../item/Game";
import { Item } from "../../item/Item";
import { PropertyType } from "../../profile/PropertyType";
import { PROPERTY_TYPE_WATCH } from "../../profile/PropertyTypes";
import CustomInteractionBebaviorItem, { CustomInteractionBebaviorItemData } from "./impl/CustomInteractionBebaviorItem";
import ItemInteractionBehaviorItem from "./impl/ItemInteractionBehaviorItem";
import TextInteractionBehaviorItem from "./impl/TextInteractionBehaviorItem";

export const InteractionBehaviorItemCreators = {
    item(item: Item, skill: PropertyType = PROPERTY_TYPE_WATCH): ItemInteractionBehaviorItem {
        return new ItemInteractionBehaviorItem({
            game: item.game,
            validSkills: [skill],
            item,
        });
    },

    text(game: Game, text: Array<string>, skill: PropertyType = PROPERTY_TYPE_WATCH): TextInteractionBehaviorItem {
        return new TextInteractionBehaviorItem({
            game,
            validSkills: [skill],
            text,
        });
    },

    custom(args: CustomInteractionBebaviorItemData) {
        return new CustomInteractionBebaviorItem(args);
    },
};