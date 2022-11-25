import { ProfileEffector } from "../profile/ProfileEffector";
import { BuffType } from "./BuffType";

export interface Buff extends ProfileEffector {
    readonly type: BuffType;
    onAdd(): void;
    onRestore(): void;
    onMerge(other: Buff): Buff;
    onRemove(): void;
}