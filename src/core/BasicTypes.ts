export type Id = string;
export type Uid = number;
export type Tag = string;
export type Int = number;
export type Double = number;
export type Text = string;

export interface Unique {
    uid: number;
}

export interface Generator<T> {
    generate(): T;
}

export type Consumer<T> = (input: T) => void;
export type Predicator<T> = (input: T) => boolean;
export type Productor<T, R> = (input: T) => R;
export type Supplier<R> = () => R;