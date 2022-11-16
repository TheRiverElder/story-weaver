import { Terrian, TerrianGenerator, Generator } from "../core/common";
import { Entity } from "../core/Entity";
import { DoorEntity } from "../core/entity/DoorEntity";
import { EnemyEntity } from "../core/entity/EnemyEntity";
import { InvestigatableEntity } from "../core/entity/InvestigatableEntity";
import { ItemEntity } from "../core/entity/ItemEntity";
import { PROPERTY_TYPE_DEXTERITY } from "../core/entity/LivingEntity";
import { NeutralEntity } from "../core/entity/NeutralEntity";
import { PlayerEntity } from "../core/entity/PlayerEntity";
import { Game } from "../core/Game";
import { ArmorItem } from "../core/item/ArmorItem";
import { FoodItem } from "../core/item/FoodItem";
import { MeleeWeapon } from "../core/item/MeleeWeapon";
import { NormalItem } from "../core/item/NormalItem";
import { PropertyType } from "../core/profile/PropertyType";
import { Room } from "../core/Room";
import { ChatOption, ChatTextFragment } from "../core/task/ChatTask";


export class WhalesTombTerrianGenerator implements TerrianGenerator {
    uidGenerator: Generator<number> = { generate: () => 0 };

    genUid = () => {
        return this.uidGenerator.generate();
    }
    
    generate(game: Game): Terrian {
        this.uidGenerator = game.uidGenerator;

        const adventurer = game.level === 1 ? new PlayerEntity({
            uid: this.genUid(),
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
            uid: this.genUid(),
            name: "217号客房",
            entities: [
                adventurer,
                new ItemEntity({
                    uid: this.genUid(),
                    item: new MeleeWeapon({
                        uid: this.genUid(),
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
            uid: this.genUid(),
            name: "走廊",
            entities: [
                this.createEntityCrit(game),
            ],
        });

        // 厨房
        const kitchenRoom = new Room({
            uid: this.genUid(),
            name: "厨房",
            entities: [
                new ItemEntity({
                    uid: this.genUid(),
                    item: new MeleeWeapon({
                        uid: this.genUid(),
                        name: "菜刀",
                        damage: 3,
                    }),
                }),
                new ItemEntity({
                    uid: this.genUid(),
                    item: new ArmorItem({
                        uid: this.genUid(),
                        name: "汤锅",
                        defense: 3,
                    }),
                }),
            ],
        });
        // 餐厅
        const dinningRoom = new Room({
            uid: this.genUid(),
            name: "餐厅",
            entities: [
                new NeutralEntity({
                    uid: this.genUid(),
                    name: "昏迷的人",
                    health: 1,
                    maxHealth: 12,
                    attackPower: 2,
                    defensePower: 0,
                    dexterity: 60,
                    tags: ["human", "passenger"],
                    chatStartFragmentId: 0,
                    chatTextFragments: [],
                }),
                new ItemEntity({
                    uid: this.genUid(),
                    item: new FoodItem({
                        uid: this.genUid(),
                        name: "蛋糕",
                        energy: 2,
                    }),
                }),
            ],
        });
        // 厕所
        const toiletRoom = new Room({
            uid: this.genUid(),
            name: "厕所",
            entities: [
                new EnemyEntity({
                    uid: this.genUid(),
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
            uid: this.genUid(),
            name: "海水净化仓",
            entities: [
                new EnemyEntity({
                    uid: this.genUid(),
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

        this.connectRooms(corridorRoom, guestRoom217, "金属门");
        this.connectRooms(corridorRoom, kitchenRoom, "金属门");
        this.connectRooms(corridorRoom, dinningRoom, "木门框");

        this.connectRooms(dinningRoom, toiletRoom, "金属门");
        this.connectRooms(dinningRoom, purificationRoom, "金属门");

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

    


    connectRooms(room1: Room, room2: Room, doorName: string, doShowtargetName: boolean = true) {
        const door1 = new DoorEntity({
            uid: this.genUid(),
            name: doorName,
            targetRoom: room2,
        });
        const door2 = new DoorEntity({
            uid: this.genUid(),
            name: doorName,
            targetRoom: room1,
        });
        room1.addEntity(door1);
        room2.addEntity(door2);
    }

    createEntityCrit(game: Game): Entity {
        const entity = new NeutralEntity({
            uid: this.genUid(),
            name: "Crit",
            health: 1,
            maxHealth: 12,
            attackPower: 2,
            defensePower: 0,
            dexterity: 60,
            tags: ["human", "crew"],
            chatStartFragmentId: "start",
        });

        const corpse = new InvestigatableEntity({
            uid: this.genUid(),
            name: "Crit的尸体",
            brief: "这是船员Crit的尸体",
            maxInvestigationAmount: 2,
            clues: [{
                validSkills: new Set<PropertyType>([PROPERTY_TYPE_DEXTERITY]),
                discoverd: false,
                text: "身上有火柴",
                onDiscover: (clue, entity, { game, actor }) => {
                    actor.appendOrDropItem(new NormalItem({
                        uid: this.genUid(),
                        name: "火柴",
                    }));
                },
            }],
        });

        const fragments: ChatTextFragment[] = [
            new ChatTextFragment(
                "start",
                [
                    "你！",
                    "舵室有型号枪",
                    "块，快去",
                    "不要乘坐救生艇！",
                    "千万不要乘坐救生艇！",
                    "啊",
                    "（这个人昏撅过去力）",
                ],
                [
                    new ChatOption("...", null, () => {
                        entity.chatTextFragments = null;
                        entity.health = 0;
                        entity.room?.addEntity(corpse);
                        entity.remove();
                        game.appendMessage(`${entity.name}死了。`);
                    }),
                ],
            ),
        ];

        entity.chatTextFragments = fragments;

        return entity;
    }

    
} 