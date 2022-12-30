import { Buff } from "../core/buff/Buff";
import { BuffType } from "../core/buff/BuffType";
import { Action, ActionGroup, ActionParams, GameInitializer, Generator } from "../core/common";
import { Entity } from "../core/Entity";
import { DoorEntity, Lock } from "../core/entity/DoorEntity";
import { EnemyEntity } from "../core/entity/EnemyEntity";
import { ItemEntity } from "../core/entity/ItemEntity";
import { NeutralEntity } from "../core/entity/NeutralEntity";
import { PlayerEntity } from "../core/entity/PlayerEntity";
import { SimpleEntity } from "../core/entity/SimpleEntity";
import { Game } from "../core/Game";
import { Clue, createItemClue, createTextClue } from "../core/InvestigatableObject";
import { ArmorItem } from "../core/item/ArmorItem";
import { FoodItem } from "../core/item/FoodItem";
import { KeyItem } from "../core/item/KeyItem";
import { MeleeWeapon } from "../core/item/MeleeWeapon";
import { NormalItem } from "../core/item/NormalItem";
import { TextItem, TextItemData } from "../core/item/TextItem";
import { PROPERTY_TYPE_ATTACK, PROPERTY_TYPE_DEFENSE, PROPERTY_TYPE_WATCH } from "../core/profile/PropertyTypes";
import { Profile } from "../core/profile/Profile";
import { PropertyType } from "../core/profile/PropertyType";
import { Room } from "../core/Room";
import { ChatOption, ChatTask, ChatTextFragment } from "../core/task/ChatTask";
import { simpleCheck } from "../core/task/FightingTask";
import { GameOverTask } from "../core/task/GameOverTask";
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
            dexterity: 100,
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
        const motherMonster = new MonsterEntity({
            game,
            name: "母体",
            health: 80,
            maxHealth: 80,
            attackPower: 5,
            defensePower: 8,
            dexterity: 50,
            tags: ["monster", "monster_mother"],
        });


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
        // 甲板
        const deckRoom = new Room({
            game,
            name: "甲板",
            entities: [
                new BoatEntity({
                    game,
                    name: "救生艇",
                    brief: "一艘木制的救生艇，看着挺结实",
                }),
            ],
        });
        game.rooms.add(deckRoom);
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
                new ItemEntity({item: new SignalPistolItem({
                    game,
                    name: "信号枪",
                    damage: 5,
                })}),
                new ItemEntity({item: new OldBookItem({
                    game,
                    name: "残破的古卷",
                    skill: PROPERTY_TYPE_READ,
                    maxDecryptAmount: 5,
                    texts: [
                        "它来自一本有关深渊海洋恶魔的书",
                        "其中一页记载了召唤与退去这种恶魔的咒语，",
                        "但是唯一能解读出来的文字并不能确是用来召唤还是驱退它的：",
                        "MI REEM REKIRTNEZXE IEB EMAN SED ULUTC RUF RIM NEMMOK EIS",
                    ],
                })}),
            ],
        });
        game.rooms.add(captainRoom);
        // 杂项地点
        const seaRoom = new Room({
            game,
            name: "大海",
            entities: [
                motherMonster,
            ],
        });
        game.rooms.add(seaRoom);

        this.connectRooms(corridorRoom, guestRoom217, "金属门", game);
        this.connectRooms(corridorRoom, kitchenRoom, "金属门", game);
        this.connectRooms(corridorRoom, dinningRoom, "木门框", game);
        this.connectRooms(corridorRoom, deckRoom, "大门", game);

        this.connectRooms(dinningRoom, toiletRoom, "金属门", game);
        this.connectRooms(dinningRoom, purificationRoom, "金属门", game);
        this.connectRooms(dinningRoom, captainRoom, "金属门", game, captainRoomDoorLock);
        this.connectRooms(dinningRoom, storeRoom, "金属门", game, storeRoomDoorLock);
        this.connectRooms(dinningRoom, deckRoom, "大门", game);

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
            items: [new FireSourceItem({ game, name: "火柴" })],
            chatProvider: () => new ChatTask(this.genUid(), game, fragments, "start"),
        });

        return entity;
    }
} 

class CritNPCEntity extends NeutralEntity {
    onGetCaptainRoomDoorLock: (() => Lock) | null = null;

    createCorpse() {

        const corpse = super.createCorpse();
        if (!corpse) return null;

        const clues: Clue[] = [
            createTextClue("皮肤溃烂严重，口中还有些许带有腥味的黑色液体"),
        ];

        if (this.onGetCaptainRoomDoorLock) {
            clues.push(createItemClue(new KeyItem({
                game: this.game,
                name: "钥匙",
                lock: this.onGetCaptainRoomDoorLock(),
            })));

            corpse.clues.push(...clues);
    
            return corpse;
        }

        return corpse;

    }

    getActionGroups(params: ActionParams): ActionGroup[] {
        const result = super.getActionGroups(params);
        const talkAction: Action = {
            text: "交谈",
            act: (params) => {
                if (this.chatProvider) {
                    const chat = this.chatProvider(params);
                    if (chat) {
                        this.game.appendInteravtiveGroup(chat);
                    }
                }
            }
        };
        result[0]?.actions.push(talkAction);
        return result;
    }
    
}

const BUFF_TYPE_CALL_OF_ABYSS = new BuffType("call_of_abyss", "深渊之召");

class CallOfAbyssBuff implements Buff {
    readonly type: BuffType = BUFF_TYPE_CALL_OF_ABYSS;

    readonly game: Game;
    level: number = 1;
    progress: number = 0;
    step: number = 0;
    private readonly listener = () => {
        // console.log("CallOfAbyssBuff listener");
        this.progress += this.step;
        if (this.progress >= 1) {
            this.game.adventurer.health--;
            this.level++;
            this.game.appendMessage(`你感觉身体越来越糟糕`);
            this.progress = 0;
        }
    };

    constructor(game: Game, level: number = 1, progress: number = 0, step: number = 0.01) {
        this.game = game;
        this.level = level;
        this.progress = progress;
        this.step = step;
    }

    onAdd() {
        this.game.updateListeners.add(this.listener);
    }

    onRestore() {
        this.game.updateListeners.add(this.listener);
    }

    onRemove() {
        this.game.updateListeners.delete(this.listener);
    }

    onMerge(other: Buff): Buff {
        if (!(other instanceof CallOfAbyssBuff)) return this;
        return this.level >= other.level ? this : other;
    }

    effect(value: number, type: PropertyType, profile: Profile): number {
        switch (type) {
            case PROPERTY_TYPE_DEFENSE: return Math.max(0, value - this.level);
            case PROPERTY_TYPE_ATTACK: return Math.max(0, value - this.level);
            default: return value;
        } 
    }
}


class MonsterEntity extends EnemyEntity {
    createCorpse() {

        const corpse = super.createCorpse();
        if (!corpse) return null;

        const clue: Clue = createTextClue("十分腥臭，全身为粘液，找不到任何骨头");
        clue.onDiscover = (clue, entity, { actor }) => {
            actor.buffs.add(new CallOfAbyssBuff(this.game, 1, 0, 0.05));
        };

        corpse.clues.push(clue);

        return corpse;
    }
}

class DynamiteItem extends NormalItem {
    explode() {
        this.game.appendMessage(`随着一声巨响，船和深渊底下的怪物一起沉入了海底`);
        this.game.appendInteravtiveGroup(new GameOverTask(this.game, "爆炸"));
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
        if (!(target instanceof ItemEntity)) return [];
        const item = target.item;
        if (!(item instanceof DynamiteItem)) return [];

        return [{
            text: "引爆",
            act: () => item.explode(),
        }];
    }
}

interface OldBookItemData extends TextItemData {
    skill: PropertyType; 
    maxDecryptAmount: number;
}

const PROPERTY_TYPE_READ = new PropertyType("read", "阅读", 20);

class OldBookItem extends TextItem {
    skill: PropertyType; 
    decrypted: boolean = false;
    decryptCounter: number = 0;
    maxDecryptAmount: number;

    constructor(data: OldBookItemData) {
        super(data);
        this.skill = data.skill;
        this.maxDecryptAmount = data.maxDecryptAmount;
    }

    getActions(): Action[] {
        const burn: Action = {
            text: '扔掉',
            act: ({ actor }) => actor.inventory.remove(this),
        }
        if (this.decrypted) {
            return [
                ...super.getActions(),
                {
                    text: `使用咒语`,
                    act: ({ actor }) => {
                        this.game.appendMessage(`你大声念出了咒语`);
                        this.game.appendMessage(`却没想到，这段咒语是用来召唤深渊母体的，`);
                        this.game.appendMessage(`随着一阵阵狂浪的逼近，你的心跳愈发紧迫，`);
                        this.game.appendMessage(`在最后吞噬船只的咆哮声出现之前，你就已经在极度的恐惧中放弃了生存的思考`);
                        this.game.appendInteravtiveGroup(new GameOverTask(this.game, "惊惧而终"));
                    },
                },
                burn,
            ];
        } else if (this.decryptCounter < this.maxDecryptAmount) {
            return [
                {
                    text: `尝试破译（${this.skill.name}）`,
                    act: ({ actor }) => {
                        if (simpleCheck(actor.getProperty(this.skill))) {
                            this.decrypted = true;
                            this.game.appendMessage(`❗你从这些文字中窥探到一些信息：`);
                            this.texts.forEach(line => this.game.appendMessage(line));
                        } else {
                            this.game.appendMessage(`什么也没破解出来`);
                        }
                        this.decryptCounter++;
                    },
                },
                burn,
            ];
        } else return [burn];
    }
}

class SignalPistolItem extends MeleeWeapon {

    getActions(params: ActionParams): Action[] {
        return super.getActions(params).concat({
            text: "发射求救信号",
            act: () => {
                this.game.appendMessage(`若干秒的火光转瞬即逝`);
                this.game.appendMessage(`你在船上焦急地等待`);
                this.game.appendMessage(`很庆幸，在几十分钟后`);
                this.game.appendMessage(`一艘轮船的探照灯找到了你的脸上`);
                this.game.appendMessage(`终于，你获救了`);
                this.game.appendInteravtiveGroup(new GameOverTask(this.game, "被其它船只救走了"));
            },
        });
    }
}

class BoatEntity extends SimpleEntity {
    getActionGroups(params: ActionParams) {
        const groups = super.getActionGroups(params);
        const action: Action = {
            text: "坐上出逃",
            act: () => {
                this.game.appendMessage(`开始的一片平静让你松了一口气`);
                this.game.appendMessage(`可是在想了一会儿后`);
                this.game.appendMessage(`你陷入了深不见底的绝望`);
                this.game.appendInteravtiveGroup(new GameOverTask(this.game, "I C U!"));
            },
        };
        if (groups.length > 0) {
            groups[0].actions.push(action);
        } else {
            groups.push({
                source: this,
                title: this.name,
                description: this.getBrief(),
                actions: [action],
            });
        }
        return groups;
    }
}