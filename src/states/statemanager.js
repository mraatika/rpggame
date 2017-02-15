import Phaser from 'phaser';
import states from '../states/states';

/**
 * Load all game states
 * @private
 * @return  {undefined}
 */
function loadStates(game) {
    states.forEach((state) => {
        if (!state.name) {
            throw new Error('Cannot add state without a name!');
        }

        if (!state.stateClass) {
            throw new Error('Cannot add state without a stateClass class');
        }

        if (!(state.stateClass.prototype instanceof Phaser.State)) {
            throw new Error('State stateClass is not an instance of Phaser.State class');
        }

        const StateClass = state.stateClass;

        game.state.add(state.name, new StateClass(game));
    });
}

/**
 * @class StateManager
 * @singleton
 * @description A class that controls the states of this game
 */
export default class StateManager {

    /**
     * Get the index of the given state in the states array
     * @private
     * @param   {string} stateName
     * @return  {number}
     */
    static getStateIndexByName(stateName) {
        for (let i = 0, len = states.length; i < len; i++) {
            if (stateName === states[i].name) {
                return i;
            }
        }
        return -1;
    }
    /**
     * Get state by it's order number
     * @private
     * @param   {number} order
     * @return  {object} StateObject
     */
    static getStateByOrderNumber(order) {
        return states.find(s => s.order === order);
    }
    /**
     *
     * @constructor
     * @return      {StateManager}
     */
    constructor(game) {
        this.currentStateIndex = -1;
        this.game = game;
        loadStates(game);
    }

    /**
     * Start state and mark it as the current state
     * @param   {string} name Name of the state in game cache
     * @return  {undefined}
     */
    start(name) {
        const stateName = name || this.nextState();
        const state = this.game.state.states[stateName];

        if (!state) {
            throw new Error(`Cannot find state ${stateName}!`);
        }

        this.currentStateIndex = StateManager.getStateIndexByName(stateName);

        console.log('Starting state', stateName, this.currentStateIndex);

        // if the state has a onStateDone signal then start listening to it
        if (state.onStateDone) {
            state.onStateDone.add((nextStateName) => {
                // the state is inactive, remove all listeners
                state.onStateDone.removeAll();
                // start the next state
                this.start(nextStateName);
            });
        }

        this.game.state.start(stateName);
    }

    /**
     * Get the next state
     * @private
     * @return  {string} Next state's identifier
     */
    nextState() {
        const nextState = states[this.currentStateIndex + 1];

        // if there is no next state then start over
        if (!nextState) {
            return null;
        }

        return nextState.name;
    }
}
