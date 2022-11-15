import { Generator, TerrianGenerator } from "../core/common";
import { DoorEntity } from "../core/entity/DoorEntity";
import { ItemEntity } from "../core/entity/ItemEntity";
import { PlayerEntity } from "../core/entity/PlayerEntity";
import { MeleeWeapon } from "../core/item/MeleeWeapon";
import { Room } from "../core/Room";
import { Terrian } from "../core/common";
import { Matrix } from "../core/util/Matrix";
import { EscapeEntity } from "../core/entity/EscapeEntity";
import { Game } from "../core/Game";
import { EnemyEntity } from "../core/entity/EnemyEntity";

export interface DefaultTerrianGeneratorData {
}

export class DefaultTerrianGenerator implements TerrianGenerator {
    uidGenerator: Generator<number> = { generate: () => 0 };

    constructor(data: DefaultTerrianGeneratorData) {
    }

    genUid = () => {
        return this.uidGenerator.generate();
    }

    private matrix: Matrix<RoomMetaNode> = new Matrix();
    private rooms: Map<number, Room> = new Map();

    generate(game: Game): Terrian {
        this.uidGenerator = game.uidGenerator;

        const adventurer = game.level === 1 ? new PlayerEntity({
            uid: this.genUid(),
            name: 'Jack',
            health: 100,
            maxHealth: 100,
            attackPower: 20,
            defensePower: 10,
            dexterity: 5,
            items: [],
        }) : game.adventurer;

        const startRoom = new Room({
            uid: this.genUid(),
            name: "初始房间",
            entities: [
                adventurer,
            ],
        });

        const originNode: RoomMetaNode = { 
            room: startRoom, 
            distance: 0, 
            x: 0, 
            y: 0,
        };
        const queue: RoomMetaNode[] = [originNode];

        while (queue.length) {
            const node = queue.shift();
            if (!node) break;

            this.rooms.set(node.room.uid, node.room);
            this.handleRoom(node, queue);
        }

        const rooms = Array.from(this.rooms.values());
        
        return { rooms };
    }
    

    handleRoom(node: RoomMetaNode, queue: RoomMetaNode[]) {
        const distance = node.distance;
        if (distance >= 20) return;

        const offsets: Vec2[] = [[-1, 0], [+1, 0], [0, -1], [0, +1]];
        const nextRoomOffsets = randomOnes<Vec2>(offsets, Math.floor(4 * Math.exp(-(distance + 1)/ 5)));
        const nextRoomNodes = nextRoomOffsets.map(it => this.createRoomNode(node, ...it)).filter(it => !!it);
        if (nextRoomNodes.length === 0) {
            node.room.addEntity(new EscapeEntity({
                uid: this.genUid(),
                name: "逃生门",
            }));
            return;
        }
        nextRoomNodes.forEach(it => {
            const n = it as RoomMetaNode;
            const doorName = randomOne(DOOR_NAMES);
            node.room.addEntity(new DoorEntity({
                uid: this.genUid(),
                name: doorName,
                targetRoom: n.room,
            }));
            n.room.addEntity(new DoorEntity({
                uid: this.genUid(),
                name: doorName,
                targetRoom: node.room,
            }));
            queue.push(n);
        });
    }

    createRoomNode(leadingNode: RoomMetaNode, xOffset: number, yOffset: number): RoomMetaNode | null {
        const x = leadingNode.x + xOffset;
        const y = leadingNode.y + yOffset;
        const distance = leadingNode.distance + 1;

        if (this.matrix.has(x, y)) return null;

        const room: Room = randomOne(ROOM_GENERATORS)(this.genUid);
        return { room, distance, x, y };
    }

}

type Vec2 = [number, number];

const DOOR_NAMES: Array<string> = [
    "铁门",
    "生锈的铁门",
    "崭新的铁门",
    "木门",
    "腐朽的木门",
    "崭新的木门",
    "纸门",
    "破旧的纸门",
    "崭新的纸门",
];

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomOne<T>(array: Array<T>): T {
    return array[Math.floor(Math.random() * array.length)];
}

function randomOnes<T>(array: Array<T>, amount: number): Array<T> {
    const buf: Array<T> = array.slice();

    for(let i = 0; i < amount; i++) {
        const j = randomInt(i, array.length);
        const tmp = buf[i];
        buf[i] = buf[j];
        buf[j] = tmp;
    }

    return buf.slice(0, amount);
}

interface RoomMetaNode {
    room: Room; // 该节点对应的房间
    distance: number; // 距离原点房间的距离，是一个曼哈顿距离
    x: number;
    y: number;
    // connectedRoomUids: Array<number>; // 通向其它房间的单向门，这是通向房间的UID
}

type RoomGenerator = (genUid: () => number) => Room;

const ROOM_GENERATORS: RoomGenerator[] = [
    genSurgenRoom,
    genDiningRoom,
];

function genSurgenRoom(genUid: () => number): Room {
    const knifeEntity = new ItemEntity({
        uid: genUid(),
        item: new MeleeWeapon({
            uid: genUid(),
            name: "手术刀",
            damage: 10,
        }),
    });
    const nurseEntity = new EnemyEntity({
        uid: genUid(),
        name: '扭曲护士',
        health: 40,
        maxHealth: 40,
        attackPower: 5,
        defensePower: 1,
        dexterity: 20,
        weapon: new MeleeWeapon({
            uid: genUid(),
            name: "手术刀",
            damage: 10,
        }),
    });

    return new Room({
        uid: genUid(),
        name: "手术室",
        entities: [
            knifeEntity,
            nurseEntity,
        ],
    });
}

function genDiningRoom(genUid: () => number): Room {
    const items = [
        new MeleeWeapon({
            uid: genUid(),
            name: "叉子",
            damage: 10,
        }),
        new MeleeWeapon({
            uid: genUid(),
            name: "餐刀",
            damage: 20,
        }),
    ];

    return new Room({
        uid: genUid(),
        name: "餐厅",
        entities: [
            ...items.map(item => new ItemEntity({ uid: genUid(), item })),
        ],
    });
}

