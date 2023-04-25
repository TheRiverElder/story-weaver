import Action from "../action/Action";
import ActionGroup from "../action/ActionGroup";
import GameObject from "../action/GameObject";
import CustomAction from "../action/impl/CustomAction";
import { Int, Unique } from "../BasicTypes";
import { LivingEntity } from "../entity/LivingEntity";
import { PlayerEntity } from "../entity/PlayerEntity";
import { InteractionTarget, INTERACTION_TARGET_EMPTY } from "../interaction/Interaction";
import { Game } from "../item/Game";

export class Chater {
    public readonly entity: LivingEntity;
    public state: any;

    constructor(entity: LivingEntity, state: any = {}) {
        this.entity = entity;
        this.state = state;
    }


}

export class ChatOption {
    public readonly text: string;
    public readonly targetId: string | number | null;
    public readonly act: (() => void) | null;

    constructor(text: string, targetId: string | number | null, act?: () => void) {
        this.text = text;
        this.targetId = targetId;
        this.act = act || null;
    }
}

export class ChatTextFragment {
    public readonly id: string | number;
    public readonly texts: string[];
    public readonly options: ChatOption[];

    constructor(id: string | number, texts: string[], options: ChatOption[]) {
        this.id = id;
        this.texts = texts;
        this.options = options;
    }

}

export class ChatTask implements Unique, GameObject {

    public readonly uid: number;
    public readonly game: Game;
    private readonly fragments = new Map<(string | number), ChatTextFragment>();
    private fragment: ChatTextFragment;
    private fragmentIndex: number = 0;

    constructor(uid: number, game: Game, fragments: ChatTextFragment[], startFragmetId: string | number) {
        this.uid = uid;
        this.game = game;
        fragments.forEach(f => this.fragments.set(f.id, f));
        const fragment = this.fragments.get(startFragmetId);
        if (!fragment) throw new Error("未找到初始文本片段");
        this.fragment = fragment;
    }

    getActionGroups(actor: PlayerEntity): ActionGroup[] {
        if (this.fragmentIndex < this.fragment.texts.length) return [new DefaultChatActionGroup()];
        else return this.fragment.options.map((o, i) => new ChatOptionActionGroup(this, i, o));
    }

    step() {
        const text: string = this.fragment.texts[this.fragmentIndex++];
        this.game.appendMessage(`对方：${text}`);
    }

    jump(targetId: string | number | null) {
        if (targetId === null) {
            this.game.removeInteravtiveGroup(this);
        } else {
            const fragment = this.fragments.get(targetId);
            if (!fragment) throw new Error("未找到目标文本片段");
            this.fragment = fragment;
        }
    }


}

export class DefaultChatActionGroup implements ActionGroup {
    getTitle(): string {
        return "...";
    }

    getDescription(): string {
        return "...";
    }

    getActions(): Action[] {
        return [];
    }

    getLabels(): string[] {
        return [];
    }

    getTarget(): InteractionTarget {
        return INTERACTION_TARGET_EMPTY;
    }

}

export class ChatOptionActionGroup implements ActionGroup {

    protected chat: ChatTask;
    protected index: Int;
    protected option: ChatOption;

    constructor(chat: ChatTask, index: Int, option: ChatOption) {
        this.chat = chat;
        this.index = index;
        this.option = option;
    }

    getTitle(): string {
        return this.index.toString();
    }

    getDescription(): string {
        return this.option.text;
    }

    getActions(): Action[] {
        return [
            new CustomAction({
                text: "...",
                act: () => {
                    this.chat.game.appendMessage(`你：${this.option.text}`);
                    this.chat.jump(this.option.targetId);
                    if (this.option.act) {
                        this.option.act();
                    }
                },
                labels: ["eat"],
            }),
        ];
    }

    getLabels(): string[] {
        return [];
    }

    getTarget(): InteractionTarget {
        return INTERACTION_TARGET_EMPTY;
    }

}
