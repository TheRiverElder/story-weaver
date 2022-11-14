import { Component } from 'react';
import './App.css';
import GameView from './components/GameView';
import { StartPage } from './components/StartPage';
import { Game } from './core/Game';

interface AppProps {
    
}
 
interface AppState {
    game: Game | null;
}
 
class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = { 
            game: null,
        };
    }

    render() { 
        const game = this.state.game;
        return (game ? (
            <GameView
                game={ game }
                onReturn={ () => this.setState(() => ({ game: null })) }
            />
        ) : (
            <StartPage
                onStart={ game => this.setState(() => ({ game })) }
            />
        ));
    }
}
 
export default App;