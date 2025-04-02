import ActionGroup from "../action/ActionGroup";
import { PlayerEntity } from "../entity/PlayerEntity";
import GameActivity from "../structure/GameActivity";

export default class SiteActivity extends GameActivity {
    
    public override getActionGroups(player: PlayerEntity): Array<ActionGroup> {
        const adventurerActionGroups = player.site?.getActionGroups();
        return adventurerActionGroups || [];
    }
}