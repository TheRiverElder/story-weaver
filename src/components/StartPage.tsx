import { Component } from "react";
import { Game } from "../core/Game";
import { IncrementNumberGenerator } from "../core/util/IncrementNumberGenerator";
import { WhalesTombGameInitializer } from "../instance/WhalesTombGameInitializer";
import "./StartPage.css";

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
            <div className="StartPage fill">
                <button style={{ padding: "1em", margin: "1em" }} onClick={ this.onClickStart }>开始</button>
            </div>
        );
    }

    onClickStart = () => {
        const uidGenerator = new IncrementNumberGenerator();
        const gameInitializer = new WhalesTombGameInitializer();
        const game = new Game({ uidGenerator, gameInitializer });
        if (game.initialize()) {
            this.props.onStart(game);
        }
    }
}