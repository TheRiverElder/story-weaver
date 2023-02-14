import { PlayerEntity } from "./entity/PlayerEntity";
import { Game } from "./Game";
import { InteractionTarget } from "./Interaction";

export interface Unique {
    uid: number;
}

export interface ActionParams {
    game: Game;
    actor: PlayerEntity; // 发送行动的实体，一般是玩家
}

export interface Action {
    text: string;
    act(params: ActionParams): void;
    labels: string[];
}

export interface ActionGroup {
    readonly source: Unique;
    readonly title: string;
    readonly description: string;
    readonly actions: Action[];
    readonly labels?: string[],
    readonly target?: InteractionTarget;
};

export interface InteractiveGroup {
    getActionGroups(params: ActionParams): ActionGroup[];
}

export type Text = string;

export interface Generator<T> {
    generate(): T;
}

export interface GameInitializer {
    initialize(game: Game): Game;
}