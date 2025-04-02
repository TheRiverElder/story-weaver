import { MESSAGE_TYPE_REPLACEABLE } from "../message/MessageTypes";
import EntityComponent from "../structure/EntityComponent";
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
            if (lock?.locked === true) return previousValue;

            const targetSiteName = this.host.game.sites.get(this.targetSiteId)?.name ?? "未知地点";

            return [
                ...previousValue,
                {
                    text: `去【${targetSiteName}】`,
                    act: (player) => {
                        const site = player.game.sites.get(this.targetSiteId);
                        if (!site) return;
                        player.teleport(site);
                        this.host.game.appendMessageText(`进入${player.site.name}`, MESSAGE_TYPE_REPLACEABLE);
                    },
                },
            ];
        })];
    }

}