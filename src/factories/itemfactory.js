import Item from 'sprites/item';
import gameConfig from 'json!assets/config/gameconfig.json';

/**
 * @class ItemFactory
 * @description A factory class for creating items
 */
export default class ItemFactory {

    /**
     * @constructor
     * @param       {Phaser.Game} game
     * @return      {ItemFactory}
     */
    constructor(game) {
        this.game = game;
    }

    /**
     * Create an item
     * @param  {string} objId An id for locating item properties from config file
     * @return {Phaser.Sprite}
     */
    create(objId) {
        const centerPoint = gameConfig.map.tileSize / 2;
        const itemProps = gameConfig.items[objId];
        const itemSprite = new Item(this.game, centerPoint, centerPoint, itemProps);

        itemSprite.center();

        return itemSprite;
    }
}