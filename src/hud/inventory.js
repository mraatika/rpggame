import {Signal} from 'phaser';
import {each} from 'lodash';
import SpriteBase from 'sprites/spritebase';

export default class Inventory extends SpriteBase {
    /**
     * @constructor
     * @param       {paramType}
     * @return      {Inventory}
     */
    constructor(game, player) {
        super(game, game.width / 2, game.height / 2, 'overlay');

        this.player = player;
        this.game = game;

        this.closeRequest = new Signal();

        this.width = 400;
        this.height = 400;

        this.alpha = 0.8;

        this.center();

        this._createCloseButton();

        this.items = this.game.add.group();

        this.events.onRevived.add(this.redrawItems, this);

    }

    redrawItems() {
        each(this.player.purse.items, item => {
            console.log(item);
        });
    }

    _createCloseButton() {
        //  And click the close button to close it down again
        const closeButton = this.game.make.sprite(-32, -32, 'close_button');
        closeButton.inputEnabled = true;
        closeButton.input.priorityID = 1;
        closeButton.setScaleMinMax(1,1);
        this.center.call(closeButton);
        closeButton.events.onInputDown.add(this._onClose, this);
        this.addChild(closeButton);
    }

    _onClose() {
        console.log('Closing inventory');
        this.closeRequest.dispatch();
    }
}