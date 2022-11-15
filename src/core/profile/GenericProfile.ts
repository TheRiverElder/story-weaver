import { Profile, Range } from "./Profile";
import { PropertyType } from "./PropertyType";

export class GenericProfile implements Profile {

    protected readonly properties = new Map<PropertyType, number>();
    protected readonly propertyRanges = new Map<PropertyType, Range>();


    getProperties(): [PropertyType, number][] {
        return Array.from(this.properties.entries());
    }

    hasProperty(type: PropertyType): boolean {
        return this.properties.has(type);
    }

    getProperty(type: PropertyType): number {
        return this.properties.get(type) || type.defaultValue;
    }

    setProperty(type: PropertyType, value?: number): void {
        const rawValue = value === undefined ? type.defaultValue : value;
        const range = this.propertyRanges.get(type);
        const finalValue = range ? Math.max(range[0], Math.min(rawValue, range[1])) : rawValue;
        this.properties.set(type, finalValue);
    }

    setPropertyRange(type: PropertyType, range: Range): void {
        this.propertyRanges.set(type, range);
    }

    getPropertyRange(type: PropertyType): Range {
        return this.propertyRanges.get(type) || [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY];
    }
}