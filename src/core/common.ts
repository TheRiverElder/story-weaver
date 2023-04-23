import { PlayerEntity } from "./entity/PlayerEntity";
import { Game } from "./item/Game";

export interface GameInitializer {
    initialize(game: Game): Game;
}