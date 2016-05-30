import {isArray, each} from 'lodash';
import {Queue} from 'datastructures';
import Turn from 'common/turn';

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
    get turn() {
        return this._turn;
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
    constructor(state, actors = []) {
        if (!isArray(actors)) {
            throw new Error('InvalidArgumentsException: Actors is invalid!');
        }

        this.state = state;
        this.actors = actors;

        this.roundIndex = ++roundIndex;
        this.isDone = false;
        this._turn = null;
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

    /**
     * Called on every game loop
     * @return {undefined}
     */
    update() {
        // if the turn is done
        if (this._turn.isDone) {
            this._nextTurn();
        }

        this._turn.update();
    }

    /**
     * Initialize the turns
     * @private
     * @param   {Array} actors An array of actors
     * @return  {undefined}
     */
    _initTurns(actors) {
        each(actors, actor => {
            this._queue.add(new Turn(
                this.state, actor, this.actors
            ));
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

        if (this._turn) this._turn.dispose();

        // if no turn is left the round is done
        if (!turn) {
            this._handleRoundDone();
            return;
        }

        turn.start();
        this._turn = turn;
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