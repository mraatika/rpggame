import Phaser from 'phaser';
import Game from 'common/game';
import states from 'states/states';
import {find} from 'lodash';
import gameConfig from 'json!assets/config/gameconfig.json';

// create new Phaser.Game instance
const game = new Game(gameConfig.screen.width, gameConfig.screen.height);

/**
 * @class StateManager
 * @singleton
 * @description A class that controls the states of this game
 */
class StateManager {
    /**
     * Returns the game object
     * @return {Game}
     */
    getGame() {
        return game;
    }

    /**
     *
     * @constructor
     * @return      {StateManager}
     */
    constructor() {
        this._currentStateIndex = -1;
        this._loadStates();
    }

    /**
     * Start the game. Loads and starts the play state.
     * @param {string} [stateName]
     * @return {undefined}
     */
    start(stateName) {
        this._startState(stateName);
    }

    /**
     * Start state and mark it as the current state
     * @private
     * @param   {string} name Name of the state in game cache
     * @return  {undefined}
     */
    _startState(name) {
        const stateName = name || this._nextState();
        const state = game.state.states[stateName];

        if (!state) {
            throw new Error('Cannot find state ' + stateName + '!');
        }

        this._currentStateIndex = this._getCurrentStateIndex(stateName);

        console.log('Starting state', stateName, this._currentStateIndex);

        // if the state has a onStateDone signal then start listening to it
        if (state.onStateDone) {
            state.onStateDone.add(stateName => {
                // the state is inactive, remove all listeners
                state.onStateDone.removeAll();
                // start the next state
                this.start(stateName);
            });
        }

        game.state.start(stateName);
    }

    /**
     * Load all game states
     * @private
     * @return  {undefined}
     */
    _loadStates() {
        for (let i = 0, len = states.length; i < len; i++) {
            let state = states[i];

            if (!state.name) {
                throw new Error('Cannot add state without a name!');
            }

            if (!state.stateClass) {
                throw new Error('Cannot add state without a stateClass class');
            }

            if (!(state.stateClass.prototype instanceof Phaser.State)) {
                throw new Error('State stateClass is not an instance of Phaser.State class');
            }

            game.state.add(state.name, new state.stateClass(game));
        }
    }

    /**
     * Get the index of the given state in the states array
     * @private
     * @param   {string} stateName
     * @return  {number}
     */
    _getCurrentStateIndex(stateName) {
        for (let i = 0, len = states.length; i < len; i++) {
            if (stateName === states[i].name) {
                return i;
            }
        }
    }

    /**
     * Get the next state
     * @private
     * @return  {string} Next state's identifier
     */
    _nextState() {
        const nextState = states[this._currentStateIndex + 1];

        // if there is no next state then start over
        if (!nextState) {
            return null;
        }

        return nextState.name;
    }

    /**
     * Get state by it's order number
     * @private
     * @param   {number} order
     * @return  {object} StateObject
     */
    _getStateByOrderNumber(order) {
        return find(states, s => s.order === order);
    }
}

// return an instance of StateManager class (singleton)
export default new StateManager();
