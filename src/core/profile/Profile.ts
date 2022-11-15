import { PropertyType } from "./PropertyType";

export type Range = [number, number];

export interface Profile {
    
    getProperties(): [PropertyType, number][];
    hasProperty(type: PropertyType): boolean;
    getProperty(type: PropertyType): number;
    setProperty(type: PropertyType, value: number): void;

    setPropertyRange(type: PropertyType, range: Range): void;
    getPropertyRange(type: PropertyType): Range;
}