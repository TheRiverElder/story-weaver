import { Unique, InteractiveGroup, ActionGroup, ActionParams } from "../common";
import { LivingEntity } from "../entity/LivingEntity";
import { Game } from "../Game";

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

export class ChatTask implements Unique, InteractiveGroup {

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

    getActionGroups(params: ActionParams): ActionGroup[] {
        return (this.fragmentIndex < this.fragment.texts.length) ?[{
            source: this,
            title: "...",
            description: "...",
            actions: [{
                text: "...",
                act: () => this.step(),
            }],
        }] : this.fragment.options.map(o => ({
            source: this,
            title: "...",
            description: o.text,
            actions: [{
                text: "...",
                act: () => {
                    this.game.appendMessage(`你：${o.text}`);
                    this.jump(o.targetId);
                    if (o.act) {
                        o.act();
                    }
                },
            }],
        }));
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