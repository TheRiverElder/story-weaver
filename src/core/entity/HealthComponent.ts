import EntityComponent from "../structure/EntityComponent";
import { constraints } from "../util/lang";
import ListenerManager from "../util/misc/ListenerManager";

export interface HealthComponentProps {
    current: number;
    max: number;
}

export default class HealthComponent extends EntityComponent {

    public health: number;
    public maxHealth: number;

    public readonly listeners = {
        change: new ListenerManager<HealthChangeEvent>(),
        die: new ListenerManager<HealthChangeEvent>()
    };

    constructor(props?: Partial<HealthComponentProps>) {
        super();
        this.health = props?.current ?? 100;
        this.maxHealth = props?.max ?? 100;
    }

    public changeHealth(amount: number, reason?: any): void {
        const oldHealth = this.health;
        this.health = constraints(this.health + amount, 0, this.maxHealth);

        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }

        const event: HealthChangeEvent = {
            component: this,
            oldHealth,
            newHealth: this.health,
            reason,
        };

        this.listeners.change.emit(event);

        if (this.health <= 0) {
            this.listeners.die.emit(event);
        }
    }
} 

export interface HealthChangeEvent {
    component: HealthComponent;
    oldHealth: number;
    newHealth: number;
    reason?: any;
}