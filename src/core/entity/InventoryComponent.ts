import { Item } from "../item/Item";
import EntityComponent from "../structure/EntityComponent";

export default class InventoryComponent extends EntityComponent {

  private inventory: Item[] = [];

  public initialize() {}

  public add(item: Item) {
    this.inventory.push(item);
  }

  public remove(item: Item) {
    const index = this.inventory.indexOf(item);
    if (index > -1) {
      this.inventory.splice(index, 1);
    }
  }
}