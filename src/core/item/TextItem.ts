import { ItemData } from "./Item";
import { ChatOption, ChatTask, ChatTextFragment } from "../task/ChatTask";
import { NormalItem } from "./NormalItem";
import Action from "../action/Action";
import CustomAction from "../action/impl/CustomAction";

export interface TextItemData extends ItemData {
    texts: string[];
}

export class TextItem extends NormalItem {
    texts: string[];
    
    constructor(data: TextItemData) {
        super(data);
        this.texts = data.texts;
    }

    getItemActions(): Action[] {
        return [new CustomAction({
            text: "阅读",
            act: () => {
                this.game.appendInteravtiveGroup(new ChatTask(
                    this.game.uidGenerator.generate(), 
                    this.game, 
                    [new ChatTextFragment(0, this.texts, [new ChatOption("结束", null)])], 
                    0,
                ))   
            },
            labels: ["eat"],
        })];
    }
}