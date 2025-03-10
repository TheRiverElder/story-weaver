export function filterNotNull<TNotNull, TNullable extends (TNotNull | null | undefined)>(array: TNullable[]): TNotNull[] {
    return array.filter(e => !!e) as any;
}

export function constraints(num: number, min: number, max: number): number {
    if (num < min) return min;
    else if (num > max) return max;
    return num;
}

export function createArray<T>(length: number, createValue: (index: number) => T): T[] {
    const array = new Array(length);
    for (let i = 0; i < array.length; i++) {
        array[i] = createValue(i);
    }
    return array;
}

export function pushIfNotNull<T>(array: Array<T>, element: T | undefined | null): Array<T> {
    if (element !== undefined && element !== null) {
        array.push(element);
    }
    return array;
}

export function invokeAllAndClear(array: Array<Function>) {
    array.forEach(e => e());
    array.splice(0, array.length);
}