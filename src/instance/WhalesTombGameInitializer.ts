import { Action, GameInitializer, Generator } from "../core/common";
import { Entity } from "../core/Entity";
import { DoorEntity, Lock } from "../core/entity/DoorEntity";
import { EnemyEntity } from "../core/entity/EnemyEntity";
import { ItemEntity } from "../core/entity/ItemEntity";
import { NeutralEntity } from "../core/entity/NeutralEntity";
import { PlayerEntity, PROPERTY_TYPE_WATCH } from "../core/entity/PlayerEntity";
import { SimpleEntity } from "../core/entity/SimpleEntity";
import { Game, GameUpdateListener } from "../core/Game";
import { Clue, createItemClue, createTextClue } from "../core/InvestigatableObject";
import { Item } from "../core/Item";
import { ArmorItem } from "../core/item/ArmorItem";
import { FoodItem } from "../core/item/FoodItem";
import { KeyItem } from "../core/item/KeyItem";
import { MeleeWeapon } from "../core/item/MeleeWeapon";
import { NormalItem } from "../core/item/NormalItem";
import { TextItem } from "../core/item/TextItem";
import { PropertyType } from "../core/profile/PropertyType";
import { Room } from "../core/Room";
import { ChatOption, ChatTask, ChatTextFragment } from "../core/task/ChatTask";
import { UsingItemTask } from "../core/task/UsingItemTask";


export class WhalesTombGameInitializer implements GameInitializer {
    uidGenerator: Generator<number> = { generate: () => 0 };

    genUid = () => {
        return this.uidGenerator.generate();
    }
    
    initialize(game: Game): Game {
        this.uidGenerator = game.uidGenerator;

        const captainRoomDoorLock: Lock = { locked: true };
        const storeRoomDoorLock: Lock = { locked: true };

        const adventurer = game.level === 1 ? new PlayerEntity({
            game,
            name: 'Jack',
            health: 7,
            maxHealth: 11,
            attackPower: 2,
            defensePower: 0,
            dexterity: 60,
            tags: ["human"],
        }) : game.adventurer;
        adventurer.profile.setProperty(PROPERTY_TYPE_WATCH, 70);

        const crit = this.createEntityCrit(game);
        crit.onGetCaptainRoomDoorLock = () => captainRoomDoorLock;

        const smallMonster = new MonsterEntity({
            game,
            name: "黑粘生物",
            health: 5,
            maxHealth: 5,
            attackPower: 2,
            defensePower: 0,
            dexterity: 60,
            tags: ["monster"],
        });
        const largeMonster = new MonsterEntity({
            game,
            name: "大型黑粘生物",
            health: 10,
            maxHealth: 10,
            attackPower: 2,
            defensePower: 3,
            dexterity: 60,
            tags: ["monster"],
        });
        const motherMonster = null;


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
        game.rooms.add(guestRoom217);

        /**
         * 走廊也是一片死寂，除了。。。一位海员，从面相上看，他已经病入膏肓了，眼球布满红血丝，黑眼圈，龟裂布满它的脸
         * 很明显他也没有说话的力气，但是似乎还有一丝意识尚存
         */
        const corridorRoom = new Room({
            game,
            name: "走廊",
            entities: [crit],
        });
        game.rooms.add(corridorRoom);

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
        game.rooms.add(kitchenRoom);
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
        game.rooms.add(dinningRoom);
        // 厕所
        const toiletRoom = new Room({
            game,
            name: "厕所",
            entities: [
                smallMonster,
            ],
        });
        game.rooms.add(toiletRoom);
        // 海水净化仓
        const purificationRoom = new Room({
            game,
            name: "海水净化仓",
            entities: [
                largeMonster,
            ],
        });
        game.rooms.add(purificationRoom);
        // 储藏间
        const storeRoom = new Room({
            game,
            name: "储藏间",
            entities: [
                new ItemEntity({
                    item: new DynamiteItem({
                        game,
                        name: "炸药"
                    }),
                }),
            ],
        });
        game.rooms.add(storeRoom);
        // 动力舱
        // 船长室
        const captainRoom = new Room({
            game,
            name: "船长室",
            entities: [
                new SimpleEntity({
                    game,
                    name: "船长的尸体",
                    brief: "看来是被穿刺心脏，失血而死",
                    maxInvestigationAmount: 2,
                    clues: [
                        createItemClue(new TextItem({
                            game,
                            name: "船长日志",
                            texts: [
                                "3月3日 晴天：今天的乘客总觉得有些奇怪",
                                "3月4日 阴天：似乎有些混种人在信奉什么异端，西往他们不要再我的船上搞事情",
                                "3月5日 下雨：（字迹潦草）可恶，这群家伙要干什么？唯一能确定的是，不能只身前往海上，不能乘坐救生艇，更不能游泳",
                                "3月6日 大风：（字迹十分潦草）如果上帝还有一丝怜悯，就让我和这艘船一起沉入这无底的深渊，而不复返吧！",
                            ],
                        })),
                    ],
                }),
            ],
        });
        game.rooms.add(captainRoom);
        // 杂项地点

        this.connectRooms(corridorRoom, guestRoom217, "金属门", game);
        this.connectRooms(corridorRoom, kitchenRoom, "金属门", game);
        this.connectRooms(corridorRoom, dinningRoom, "木门框", game);

        this.connectRooms(dinningRoom, toiletRoom, "金属门", game);
        this.connectRooms(dinningRoom, purificationRoom, "金属门", game);
        this.connectRooms(dinningRoom, captainRoom, "金属门", game, captainRoomDoorLock);
        this.connectRooms(dinningRoom, storeRoom, "金属门", game, storeRoomDoorLock);

        return game;
    }


    connectRooms(room1: Room, room2: Room, doorName: string, game: Game, lock?: Lock, doShowtargetName: boolean = true): [DoorEntity, DoorEntity] {
        const door1 = new DoorEntity({
            game,
            lock,
            name: doorName,
            targetRoom: room2,
        });
        const door2 = new DoorEntity({
            game,
            lock,
            name: doorName,
            targetRoom: room1,
        });
        room1.addEntity(door1);
        room2.addEntity(door2);

        return [door1, door2];
    }

    createEntityCrit(game: Game): CritNPCEntity {

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
    onGetCaptainRoomDoorLock: (() => Lock) | null = null;

    onDied() {
        const clues: Clue[] = [
            createItemClue(new FireSourceItem({
                game: this.game,
                name: "火柴",
            })),
            createTextClue("皮肤溃烂严重，口中还有些许带有腥味的黑色液体"),
        ];

        if (this.onGetCaptainRoomDoorLock) {
            clues.push(createItemClue(new KeyItem({
                game: this.game,
                name: "钥匙",
                lock: this.onGetCaptainRoomDoorLock(),
            })));
        }

        const corpse = new SimpleEntity({
            game: this.game,
            name: `${this.name}的尸体`,
            brief: `这是船员${this.name}的尸体`,
            maxInvestigationAmount: 5,
            clues: clues,
        });

        this.room?.addEntity(corpse);
    }
}



class MonsterEntity extends EnemyEntity {
    createCorpse() {

        const corpse = super.createCorpse();
        if (!corpse) return null;

        const clue: Clue = createTextClue("十分腥臭，全身为粘液，找不到任何骨头");
        clue.onDiscover = () => {
            let progress = 0;
            const listener: GameUpdateListener = () => {
                progress += 0.03;
                if (progress >= 1) {
                    this.game.adventurer.health = 0;
                    this.game.appendMessage(`你感觉身体越来越糟糕`);
                    this.game.updateListeners.delete(listener);
                }
            };
            this.game.updateListeners.add(listener);
        };

        corpse.clues.push(clue);

        return corpse;
    }
}

class DynamiteItem extends NormalItem {
    explode() {
        this.game.appendMessage(`随着一声巨响，船和深渊底下的怪物一起沉入了海底`);
    }
}

class FireSourceItem extends NormalItem {

    getActions(): Action[] {
        return [{
            text: "使用",
            act: () => this.game.appendInteravtiveGroup(new UsingItemTask(this)),
        }]
    }

    getUsageActions(actor: PlayerEntity, target: Entity | null): Action[] {
        if (!(target instanceof ItemEntity) || !(target.item instanceof DynamiteItem)) return [];
        return [{
            text: "引爆",
            act: () => (target.item as DynamiteItem).explode(),
        }];
    }
}