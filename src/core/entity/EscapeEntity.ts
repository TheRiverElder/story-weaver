import { Action, ActionGroup } from "../common";
import { Entity } from "./Entity";


export class EscapeEntity extends Entity {

    getActionGroups(): ActionGroup[] {
        const walkThroughAction: Action = {
            text: '逃离' + this.brief,
            labels: ['escape'],
            act: ({ game, actor }) => {
                alert(`${actor.name}逃离第${game.level}层！进入下一层。`);
                game.level += 1;
                game.initialize();
            }
        };
        return [{
            source: this,
            title: this.name,
            description: this.brief,
            actions: [walkThroughAction],
        }];
    }

    // 获取该实体的一段简短描述，例如名字、血量、物品类型等
    get brief() {
        return `【出口】${this.name}`;
    }

}