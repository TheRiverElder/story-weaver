import classNames from "classnames";
import React, { Component, MouseEvent } from "react";
import { Action, ActionGroup } from "../core/common";
import { Game, Message } from "../core/item/Game";
import { SLOT_TYPE_WEAPON } from "../core/inventory/LivingEntityInventory";
import { PROPERTY_TYPE_ATTACK, PROPERTY_TYPE_LISTEN, PROPERTY_TYPE_USE, PROPERTY_TYPE_WATCH } from "../core/profile/PropertyTypes";
import { PropertyType } from "../core/profile/PropertyType";
import "./GameView.css";
import { filterNotNull } from "../core/util/lang";
import { Interaction, MEDIA_EMPTY } from "../core/interaction/Interaction";

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
                            <div className="text">{this.renderMessage(m)}</div>
                        </div>
                    )) }
                </main>

                <div 
                    className="cards fill-x animate-flash-appear" key={ this.programCounter }
                    onClick={this.resetSelectedGroup.bind(this)}
                >
                    { this.state.actionGroups.map(this.renderActionGroupView.bind(this)) }
                </div>
                
                { this.renderSkillSelectionBar() }
            </div>
        );
    }

    renderMessage(message: Message) {
        return (
            <div>
                {message.text.split("\n").map(line => (
                    <p>{line}</p>
                ))}
            </div>
        );
    }


    renderTopBar() {
        const { game } = this.props;
        const adventurer = game.adventurer;

        const properties: [string, string | number | undefined][] = [
            ["lvl", game.level],
            ["@", adventurer.room?.name],
            ["♥", `${adventurer.health}/${adventurer.maxHealth}`],
            ["🗡", adventurer.attackPower],
            ["🛡", adventurer.defensePower],
            ["🏃‍♀️", adventurer.dexterity],
            ["🔪", adventurer.weapon?.name],
            ["☂️", adventurer.armor?.name],
        ];

        return (
            <header className="top-bar">
                { properties.map(([icon, content]) => (content !== undefined) && (
                    <div className="property" key={ icon }>
                        <span className="icon">{icon}</span>
                        <span className="content">{content}</span>
                    </div>
                )) }
            </header>
        );
    }

    renderActionGroupView(actionGroup: ActionGroup, index: number, actionGroups: ActionGroup[]) {
        const groupIndex = this.state.groupIndex;
        return (
            <div 
                className={ classNames("card-wrapper", (groupIndex >= 0 && index > groupIndex) && "abdicated")}
            >
                <div 
                    className={ classNames("card", groupIndex === index && "selected", actionGroup.labels || "empty") } 
                    key={ index } 
                    onClick={event => this.toggleSelectedGroup(event, index)}
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
                className={ classNames("action-button", "fill-x", action.labels || "empty") }
                key={ index }
                onClick={ event => this.onClickActionButton(event, action) }
            >{ action.text }</button>
        );
    }

    renderSkillSelectionBar() {
        const actionGroup = this.state.actionGroups[this.state.groupIndex];
        const target = actionGroup?.target;
        let collapsed = true;
        if (target) {
            const interaction: Interaction = {
                actor: this.props.game.adventurer,
                media: MEDIA_EMPTY,
                skill: PROPERTY_TYPE_USE,
                target: actionGroup.target,
            };
            collapsed = !target.canReceiveInteraction(interaction);
        }
        return (
            <div className={ classNames("skill-selection-bar", { collapsed }) }>
                { this.getSkills().map(skill => (
                    <button onClick={() => this.onClickSkillButton(skill)}>{skill.name}</button>
                )) }
            </div>
        );
    }

    getSkills(): PropertyType[] {
        return filterNotNull([
            PROPERTY_TYPE_ATTACK,
            PROPERTY_TYPE_LISTEN,
            PROPERTY_TYPE_WATCH,
            this.props.game.adventurer.inventory.getSpecialSlot(SLOT_TYPE_WEAPON)?.get() && PROPERTY_TYPE_USE,
        ]);
    }

    toggleSelectedGroup(event: MouseEvent, index: number) {
        event.stopPropagation();
        this.setState(s => ({ groupIndex: s.groupIndex === index ? -1 : index }));
    }

    resetSelectedGroup(event: MouseEvent) {
        event.stopPropagation();
        this.setState(() => ({ groupIndex: -1 }));
    }

    onClickActionButton(event: MouseEvent, action: Action) {
        event.stopPropagation();
        this.props.game.runAction(action);
        this.update();
    }

    onClickSkillButton(skill: PropertyType) {
        const actionGroup = this.state.actionGroups[this.state.groupIndex];
        if (!actionGroup) return;

        const target = actionGroup.target;
        if (!target) return;
        
        const actor = this.props.game.adventurer;
        const interaction: Interaction = {
            actor,
            media: actor.inventory.getSpecialSlot(SLOT_TYPE_WEAPON)?.get() || MEDIA_EMPTY, 
            skill,
            target,
        };

        this.props.game.interact(interaction);
        this.forceUpdate();
    }
}
 
export default GameView;

function timestampToString(timestamp: Date): string {
    return timestamp.getHours() + ":" + timestamp.getMinutes().toString().padStart(2, '0');
}