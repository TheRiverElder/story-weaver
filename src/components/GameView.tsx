import React, { Component, MouseEvent } from "react";
import { Action, ActionGroup } from "../core/common";
import { Game } from "../core/Game";
import "./GameView.css";

interface GameViewProps {
    game: Game;
    onReturn: () => void;
}
 
interface GameViewState {
    actionGroups: ActionGroup[];
    groupIndex: number;
}
 
class GameView extends Component<GameViewProps, GameViewState> {

    constructor(props: GameViewProps) {
        super(props);
        this.state = {
            actionGroups: [],
            groupIndex: -1,
        };
    }

    componentDidMount() {
        this.props.game.updateListeners.add(this.update);
        this.props.game.gameOverListeners.add(this.props.onReturn);
        this.update();
    }

    componentWillUnmount() {
        this.props.game.updateListeners.delete(this.update);
        this.props.game.gameOverListeners.delete(this.props.onReturn);
    }

    programCounter = 0;

    update = () => {
        this.programCounter++;
        this.setState((_, { game }) => ({ 
            actionGroups: game.getActionGroups({ game, actor: game.adventurer }),
            groupIndex: -1,
        }));
    }

    componentDidUpdate() {
        const div = this.messageBox.current;
        if (!div) return;
        div.scrollTo({ left: 0, top: div.scrollHeight, behavior: "smooth" });
    }

    private readonly messageBox = React.createRef<HTMLDivElement>();

    render() {
        return (
            <div className="GameView fill">
                { this.renderTopBar() }

                <main className="messages fill-x" ref={ this.messageBox }>
                    { this.props.game.messages.map((m, i) => (
                        <div className="message animate-message-appear" key={i}>
                            <span className="timestamp">{timestampToString(m.timestamp)}</span>
                            <span className="text">{m.text}</span>
                        </div>
                    )) }
                </main>

                <div 
                    className="cards fill-x animate-flash-appear" key={ this.programCounter }
                    onMouseLeave={() => this.setState(() => ({ groupIndex: -1 }))}
                    // onTouchEnd={() => this.setState(() => ({ groupIndex: -1 }))}
                    // onBlur={() => this.setState(() => ({ groupIndex: -1 }))}
                >
                    { this.state.actionGroups.map(this.renderActionGroupView.bind(this)) }
                </div>
            </div>
        );
    }


    renderTopBar() {
        const { game } = this.props;
        const adventurer = game.adventurer;
        const room = adventurer.room;
        
        // const text = `
        //     当前层级：${game.level}
        //     当前房间：#${room?.uid} ${room?.name}
        //     房内实体：${room?.entities.values().map(it => it.getBrief()).join("，")}
        //     冒险者状态：生命：${adventurer.health}/${adventurer.maxHealth}，攻击力：${adventurer.attackPower}，防御力：${adventurer.defensePower}，敏捷：${adventurer.dexterity}
        //     物品：${adventurer.inventory.size == 0 ? "空" : adventurer.inventory.values().map(it => it.name).join("，")}
        // `;

        const weapon = adventurer.weapon == null ? "" : "|🔪" + adventurer.weapon.name;
        const armor = adventurer.armor == null ? "" : "|☂️" + adventurer.armor.name;
        
        const text = `
            lvl.${game.level} @${room?.name}
            ♥${adventurer.health}/${adventurer.maxHealth}|🗡${adventurer.attackPower}|🛡${adventurer.defensePower}|🏃‍♀️${adventurer.dexterity}${weapon}${armor}
        `;
        return (
            <header className="top-bar">{ text.split('\n').map((it, i) => (<p key={ i }>{ it }</p>)) }</header>
        );
    }

    renderActionGroupView(actionGroup: ActionGroup, index: number, actionGroups: ActionGroup[]) {
        const groupIndex = this.state.groupIndex;
        return (
            <div 
                className={ "card-wrapper " + (groupIndex >= 0 && index > groupIndex ? "abdicated" : "")}
            >
                <div 
                    className={ "card " + (actionGroup.labels?.join(' ') || "empty") } 
                    key={ index } 
                    // onMouseDown={() => this.setState(() => ({ groupIndex: index }))}
                    // onTouchStart={() => this.setState(() => ({ groupIndex: index }))}
                    onClick={event => this.onSelectGroup(event, index)}
                >
                    <div className="content">
                        <div>
                            <h3 className="title">{ actionGroup.title }</h3>
                            <article>{ actionGroup.description }</article>
                        </div>

                        <div className="buttons fill-x">
                            { actionGroup.actions.map(this.renderActionButton.bind(this)) }
                        </div>

                        <div className="index">
                            -= 第{index + 1}张 / 共{actionGroups.length}张 =-
                        </div>
                    </div>
                    <div className="small-title">
                        <span>{ actionGroup.title }</span>
                    </div>
                </div>
            </div>
        );
    }

    renderActionButton(action: Action, index: number) {
        return (
            <button 
                className={ "action-button fill-x " + (action.labels?.join(' ') || '') }
                key={ index }
                onClick={ event => this.onClickActionButton(event, action) }
            >{ action.text }</button>
        );
    }

    onSelectGroup(event: MouseEvent, index: number = -1) {
        event.stopPropagation();
        this.setState(() => ({ groupIndex: index }));
    }

    onClickActionButton(event: MouseEvent, action: Action) {
        event.stopPropagation();
        this.props.game.runAction(action);
        this.update();
    }
}
 
export default GameView;

function timestampToString(timestamp: Date): string {
    return timestamp.getHours() + ":" + timestamp.getMinutes().toString().padStart(2, '0');
}