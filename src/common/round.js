import { Queue } from 'datastructures';
import Turn from './turn';

let roundIndex = 0;

/**
 * Initialize the turns
 * @private
 * @param   {Array} actors An array of actors
 * @return  {undefined}
 */
function initTurns(state, actors) {
    console.log(actors);
    return actors.map(actor => new Turn(state, actor));
}

/**
 * @class Round
 * @description A class that represents a round of turns in the game
 */
export default class Round {
    /**
     * @constructor
     * @param       {Phaser.Game} game
     * @param       {Phaser.TileMap} map
     * @param       {Array} actors
     * @return      {Round}
     */
    constructor(state, actors = []) {
        if (!Array.isArray(actors)) {
            throw new Error('InvalidArgumentsException: Actors is invalid!');
        }

        this.state = state;
        this.actors = actors;

        this.roundIndex = ++roundIndex;
        this.isDone = false;
        this.turn = null;
        this.queue = new Queue();

        this.queue.add(...initTurns(this.state, actors));
    }

    /**
     * Start the round
     * @return {undefined}
     */
    start() {
        // if there are no turns in the queue then the round
        // is immediately done
        if (!this.queue.size()) {
            this.isDone = true;
            return;
        }

        // start the first turn
        this.nextTurn();
    }

    /**
     * Called on every game loop
     * @return {undefined}
     */
    update() {
        // if the turn is done
        if (this.turn.isDone) {
            this.nextTurn();
        }

        this.turn.update();
    }

    /**
     * Start the ǵiven turn and recursively start the next turn when current is done
     * @private
     * @param   {Turn} turn
     * @return  {undefined}
     */
    nextTurn() {
        const turn = this.queue.next();

        if (this.turn) this.turn.dispose();

        // if no turn is left the round is done
        if (!turn) {
            this.isDone = true;
            return;
        }

        turn.start();
        this.turn = turn;
    }
}
