import { Queue } from 'datastructures';
import createTurn from './turn';

let roundIndex = 0;

/**
 * @name Round
 * A class that represents a round of turns in the game
 * @param {Phaser.State} game
 * @param {ActorSprite[]} actors
 * @return {Round}
 */
export default function createRound(state, actors = []) {
    if (!Array.isArray(actors)) {
        throw new Error('InvalidArgumentsException: Actors is invalid!');
    }

    const turnQueue = new Queue();

    const publicProps = {
        roundIndex: ++roundIndex,
        isDone: false,
        turn: null,
    };

    // create turn for each actor
    actors.map(actor => turnQueue.add(createTurn(state, actor)));

    const methods = {
        /**
         * Return a copy of turn queue entries
         * @returns {Turn[]}
         */
        getTurns() {
            return turnQueue.entries;
        },

        /**
         * Start the round
         * @return {undefined}
         */
        start() {
            // if there are no turns in the queue then the round
            // is immediately done
            if (!turnQueue.size()) {
                this.isDone = true;
                return;
            }

            // start the first turn
            this.nextTurn();
        },

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
        },

        /**
         * Start the given turn and recursively start the next turn when current is done
         * @private
         * @param   {Turn} turn
         * @return  {undefined}
         */
        nextTurn() {
            const turn = turnQueue.next();

            if (this.turn) this.turn.dispose();

            // if no turn is left the round is done
            if (!turn) {
                this.isDone = true;
                return;
            }

            turn.start();
            this.turn = turn;
        },
    };

    return Object.assign(
        {},
        publicProps,
        methods,
    );
}
