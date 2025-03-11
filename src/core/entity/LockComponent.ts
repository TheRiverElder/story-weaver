import EntityComponent from "../structure/EntityComponent";

export interface LockComponentProps {
    key: string; 
    locked?: boolean;
}

export default class LockComponent extends EntityComponent {

    public readonly key: string; // Key of the lock

    private _locked: boolean; // Whether or not the lock is locked (true means it is locked)
    public get locked(): boolean { return this._locked }

    constructor(props: LockComponentProps = {key: '', locked: false}) {
        super();
        this.key = props.key; 
        this._locked = props.locked ?? false; // default to unlocked if not specified
    }

    public unlock(key: string): boolean {
        if (this._locked && key === this.key) {
            this._locked = false;
            return true;
        }
        return false;
    }

    public lock(): void {
        this._locked = true;
    }

    protected override onRegisterListeners() {
        return [this.host.modifiers.descriptions.add(d => this.locked ? [...d, "已上锁。"] : d)];
    }

}