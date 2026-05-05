import { Item } from "../item/Item";
import EntityComponent from "../structure/EntityComponent";

export default class InventoryComponent extends EntityComponent {

    private _items: Item[] = [];
    public get items() {
        return this._items.slice();
    }

    public initialize() { }

    public add(item: Item): boolean {
        if (this._items.indexOf(item) === -1) {//if item is not in inventory
            this._items.push(item);
            return true;
        }
        return false;
    }

    public remove(item: Item): boolean {
        const index = this._items.indexOf(item);
        if (index > -1) {
            this._items.splice(index, 1);
            return true;
        }
        return false;
    }
}