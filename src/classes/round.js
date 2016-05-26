import {isArray, each, without} from 'lodash';
import {Queue} from 'datastructures';
import Turn from 'classes/turn';

let roundIndex = 0;

/**
 * @class Round
 * @description A class that represents a round of turns in the game
 */
export default class Round {

    /**
     * Getter for current turn
     * @return {Turn}
     */
    get currentTurn() {
        return this._currentTurn;
    }

    /**
     * Getter for turn queue
     * @return {Queue}
     */
    get queue() {
        return this._queue;
    }

    /**
     * @constructor
     * @param       {Phaser.Game} game
     * @param       {Phaser.TileMap} map
     * @param       {Array} actors
     * @return      {Round}
     */
    constructor(game, map, actors = []) {
        if (!isArray(actors)) {
            throw new Error('InvalidArgumentsException: Actors is invalid!');
        }

        this.game = game;
        this.map = map;
        this.actors = actors;

        this.roundIndex = ++roundIndex;
        this.isDone = false;
        this._queue = new Queue();

        this._initTurns(actors);
    }

    /**
     * Start the round
     * @return {undefined}
     */
    start() {
        // if there are no turns in the queue then the round
        // is immediately done
        if (!this._queue.size()) {
            this._handleRoundDone();
            return;
        }

        // start the first turn
        this._nextTurn();
    }

    update() {
        if (this._currentTurn.isDone) {
            this._nextTurn();
        }

        this._currentTurn.update();
    }

    /**
     * Initialize the turns
     * @private
     * @param   {Array} actors An array of actors
     * @return  {undefined}
     */
    _initTurns(actors) {
        each(actors, actor => {
            this._queue.add(new Turn(this.game, this.map, actor, without(this.actors, actor)));
        });
    }

    /**
     * Start the ǵiven turn and recursively start the next turn when current is done
     * @private
     * @param   {Turn} turn
     * @return  {undefined}
     */
    _nextTurn() {
        const turn = this._queue.next();

        // if no turn is left the round is done
        if (!turn) {
            this._handleRoundDone();
            return;
        }

        turn.start();
        this._currentTurn = turn;
    }

    /**
     * Dispatch roundDone event and clean event listeners
     * @private
     * @return  {undefined}
     */
    _handleRoundDone() {
        this.isDone = true;
    }
}