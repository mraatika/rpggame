import SpriteBase from '../sprites/spritebase';
import Inventory from './inventory/inventory';
import mount from '../dom/vuerenderer';

export default class InventoryButton extends SpriteBase {
    constructor(game, x, y, player) {
        super(game, x, y, 'inventory_button');

        this.player = player;

        this.width = 90;
        this.height = 90;

        this.center();

        this.inputEnabled = true;
        this.priorityId = 1;
        this.events.onInputDown.add(() => this.showInventory());
    }

    showInventory() {
        if (!this.inventory) {
            this.inventory = mount(Inventory, { player: this.player });
        }

        this.inventory.show();
    }
}
