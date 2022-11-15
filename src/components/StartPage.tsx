import { Component } from "react";
import { Game } from "../core/Game";
import { IncrementNumberGenerator } from "../core/util/IncrementNumberGenerator";
import { WhalesTombTerrianGenerator } from "../instance/WhalesTombTerrianGenerator";

export interface StartPageProps {
    onStart: (game: Game) => void;
}
 
export interface StartPageState {
    
}
 
export class StartPage extends Component<StartPageProps, StartPageState> {
    constructor(props: StartPageProps) {
        super(props);
        this.state = {};
    }
    
    render() { 
        return (
            <div>
                <button onClick={ this.onClickStart }>开始</button>
            </div>
        );
    }

    onClickStart = () => {
        const uidGenerator = new IncrementNumberGenerator();
        const terrianGenerator = new WhalesTombTerrianGenerator();
        const game = new Game({ uidGenerator, terrianGenerator });
        if (game.initialize()) {
            this.props.onStart(game);
        }
    }
}