import { Terrian, TerrianGenerator, Generator } from "../core/common";
import { Entity } from "../core/Entity";
import { DoorEntity } from "../core/entity/DoorEntity";
import { EnemyEntity } from "../core/entity/EnemyEntity";
import { InvestigatableEntity } from "../core/entity/InvestigatableEntity";
import { ItemEntity } from "../core/entity/ItemEntity";
import { LivingEntity, PROPERTY_TYPE_DEXTERITY } from "../core/entity/LivingEntity";
import { NeutralEntity } from "../core/entity/NeutralEntity";
import { PlayerEntity, PROPERTY_TYPE_WATCH } from "../core/entity/PlayerEntity";
import { Game } from "../core/Game";
import { ArmorItem } from "../core/item/ArmorItem";
import { FoodItem } from "../core/item/FoodItem";
import { MeleeWeapon } from "../core/item/MeleeWeapon";
import { NormalItem } from "../core/item/NormalItem";
import { PropertyType } from "../core/profile/PropertyType";
import { Room } from "../core/Room";
import { ChatOption, ChatTask, ChatTextFragment } from "../core/task/ChatTask";


export class WhalesTombTerrianGenerator implements TerrianGenerator {
    uidGenerator: Generator<number> = { generate: () => 0 };

    genUid = () => {
        return this.uidGenerator.generate();
    }
    
    generate(game: Game): Terrian {
        this.uidGenerator = game.uidGenerator;

        const adventurer = game.level === 1 ? new PlayerEntity({
            game,
            name: 'Jack',
            health: 7,
            maxHealth: 11,
            attackPower: 2,
            defensePower: 0,
            dexterity: 60,
            items: [],
            tags: ["human"],
        }) : game.adventurer;


        /**
         * 客房
         * 啊，亲爱的鲸鱼之墓号乘客，你醒啦？
         * 几个小时前，船舱内发生了一阵不明原因的骚乱，你也在那场骚乱中仓皇逃回了自己的客房。
         * 现在这里是伸手不见五指的海面上，周围的人都不见了，墙壁的微弱的灯光依稀照亮门廊
         * 你旁边的人都没醒来，周围一片死寂
         */
        const guestRoom217 = new Room({
            game,
            name: "217号客房",
            entities: [
                adventurer,
                new ItemEntity({
                    game,
                    item: new MeleeWeapon({
                        game,
                        name: "拆信刀",
                        damage: 1,
                    }),
                }),
            ],
        });

        /**
         * 走廊也是一片死寂，除了。。。一位海员，从面相上看，他已经病入膏肓了，眼球不满红血丝，黑眼圈，龟裂布满它的脸
         * 很明显他也没有说话的力气，但是似乎还有一丝意识尚存
         */
        const corridorRoom = new Room({
            game,
            name: "走廊",
            entities: [
                this.createEntityCrit(game),
            ],
        });

        // 厨房
        const kitchenRoom = new Room({
            game,
            name: "厨房",
            entities: [
                new ItemEntity({
                    game,
                    item: new MeleeWeapon({
                        game,
                        name: "菜刀",
                        damage: 3,
                    }),
                }),
                new ItemEntity({
                    game,
                    item: new ArmorItem({
                        game,
                        name: "汤锅",
                        defense: 3,
                    }),
                }),
            ],
        });
        // 餐厅
        const dinningRoom = new Room({
            game,
            name: "餐厅",
            entities: [
                new NeutralEntity({
                    game,
                    name: "昏迷的人",
                    health: 1,
                    maxHealth: 12,
                    attackPower: 2,
                    defensePower: 0,
                    dexterity: 60,
                    tags: ["human", "passenger"],
                }),
                new ItemEntity({
                    game,
                    item: new FoodItem({
                        game,
                        name: "蛋糕",
                        energy: 2,
                    }),
                }),
            ],
        });
        // 厕所
        const toiletRoom = new Room({
            game,
            name: "厕所",
            entities: [
                new EnemyEntity({
                    game,
                    name: "黑色粘稠生物",
                    health: 5,
                    maxHealth: 5,
                    attackPower: 2,
                    defensePower: 0,
                    dexterity: 60,
                    tags: ["monster"],
                }),
            ],
        });
        // 海水净化仓
        const purificationRoom = new Room({
            game,
            name: "海水净化仓",
            entities: [
                new EnemyEntity({
                    game,
                    name: "大号黑色粘稠生物",
                    health: 10,
                    maxHealth: 10,
                    attackPower: 2,
                    defensePower: 3,
                    dexterity: 60,
                    tags: ["monster"],
                }),
            ],
        });
        // 动力舱
        // 杂项地点

        this.connectRooms(corridorRoom, guestRoom217, "金属门", game);
        this.connectRooms(corridorRoom, kitchenRoom, "金属门", game);
        this.connectRooms(corridorRoom, dinningRoom, "木门框", game);

        this.connectRooms(dinningRoom, toiletRoom, "金属门", game);
        this.connectRooms(dinningRoom, purificationRoom, "金属门", game);

        return {
            rooms: [
                corridorRoom,
                guestRoom217,
                kitchenRoom,
                dinningRoom,
                toiletRoom,
                purificationRoom,
            ],
        };
    }

    


    connectRooms(room1: Room, room2: Room, doorName: string, game: Game, doShowtargetName: boolean = true) {
        const door1 = new DoorEntity({
            game,
            name: doorName,
            targetRoom: room2,
        });
        const door2 = new DoorEntity({
            game,
            name: doorName,
            targetRoom: room1,
        });
        room1.addEntity(door1);
        room2.addEntity(door2);
    }

    createEntityCrit(game: Game): Entity {

        const fragments: ChatTextFragment[] = [
            new ChatTextFragment(
                "start",
                [
                    "你！",
                    "舵室有信号枪",
                    "快，快去",
                    "不要乘坐救生艇！",
                    "千万不要乘坐救生艇！",
                    "啊！",
                    "（这个人失去了气息）",
                ],
                [
                    new ChatOption("什...？", null, () => {
                        entity.chatProvider = null;
                        entity.die();
                    }),
                ],
            ),
        ];

        const entity = new CritNPCEntity({
            game,
            name: "Crit",
            health: 1,
            maxHealth: 12,
            attackPower: 2,
            defensePower: 0,
            dexterity: 60,
            tags: ["human", "crew"],
            chatProvider: () => new ChatTask(this.genUid(), game, fragments, "start"),
        });

        return entity;
    }
} 

class CritNPCEntity extends NeutralEntity {
    onDied() {
        const corpse = new InvestigatableEntity({
            game: this.game,
            name: `${this.name}的尸体`,
            brief: `这是船员${this.name}的尸体`,
            maxInvestigationAmount: 2,
            clues: [
                {
                    validSkills: new Set<PropertyType>([PROPERTY_TYPE_WATCH]),
                    discoverd: false,
                    text: "身上有火柴",
                    onDiscover: (clue, entity, { game, actor }) => {
                        actor.appendOrDropItem(new NormalItem({
                            game,
                            name: "火柴",
                        }));
                    },
                },
                {
                    validSkills: new Set<PropertyType>([PROPERTY_TYPE_WATCH]),
                    discoverd: false,
                    text: "皮肤溃烂严重，口中还有些许带有腥味的黑色液体",
                },
            ],
        });

        this.room?.addEntity(corpse);
    }
}