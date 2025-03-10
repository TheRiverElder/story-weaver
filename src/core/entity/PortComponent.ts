import EntityComponent from "../structure/EntityComponent";
import Site from "../structure/Site";

export default class PortComponent extends EntityComponent {


    private targetSiteId: string;

    constructor(targetSiteId: string) {
        super();
        this.targetSiteId = targetSiteId;
    }

    public override onRegisterListeners() {
        return [this.host.modifiers.actions.add((previousValue) => [
            ...previousValue,
            {
                text: "Port",
                act: (player) => {
                    const site: Site = player.game.sites.find(this.targetSiteId);
                    player.teleport(site);
                },
            },
        ])];
    }

}