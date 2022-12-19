import { Room } from "./Room";
import { PlayerEntity } from "./entity/PlayerEntity";
import { Game } from "./Game";
import { Entity } from "./Entity";

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
    labels?: string[];
}

export interface ActionGroup {
    source: Unique;
    title: string;
    description: string;
    actions: Action[];
    labels?: string[],
};

export interface InteractiveGroup {
    getActionGroups(params: ActionParams): ActionGroup[];
}

export type Text = string;

export interface Generator<T> {
    generate(): T;
}

export interface Terrian {
    rooms: Room[];
}

export interface GameInitializer {
    initialize(game: Game): Game;
}