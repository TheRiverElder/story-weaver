export function filterNotNull<TNotNull, TNullable extends (TNotNull | null | undefined)>(array: TNullable[]): TNotNull[] {
    return array.filter(e => !!e) as any;
}