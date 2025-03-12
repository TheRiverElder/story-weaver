import EntityComponent from "../structure/EntityComponent";
import Site from "../structure/Site";
import LockComponent from "./LockComponent";

export default class PortComponent extends EntityComponent {


    private targetSiteId: string;

    constructor(targetSiteId: string) {
        super();
        this.targetSiteId = targetSiteId;
    }

    public override onRegisterListeners() {
        return [this.host.modifiers.actions.add((previousValue) => {

            const lock = this.host.components.get(LockComponent);
    
            if (lock?.locked) return previousValue;

            return [
                ...previousValue,
                {
                    text: "Port",
                    act: (player) => {
                        const site: Site = player.game.sites.find(this.targetSiteId);
                        player.teleport(site);
                        this.host.game.appendMessageText(`进入${this.site.name}`, MESSAGE_TYPE_REPLACEABLE);
                    },
                },
            ];
        })];
    }

}