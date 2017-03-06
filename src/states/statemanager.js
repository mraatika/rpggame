import states from '../states/states';

/**
 * Get the index of the given state in the states array
 * @private
 * @param   {string} stateName
 * @return  {number}
 */
export function getStateIndexByName(stateName) {
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
export function getStateByOrderNumber(order) {
    return states.find(s => s.order === order);
}

/**
 * Load all game states to the game
 * @private
 */
function loadStates(game) {
    states.forEach((state) => {
        if (!state.name) {
            throw new Error('Cannot add state without a name!');
        }

        if (!state.stateClass) {
            throw new Error('Cannot add state without a stateClass class');
        }

        game.state.add(state.name, state.stateClass(game));
    });
}

/**
 * @class StateManager
 * @singleton
 * @description A class that controls the states of this game
 */
export default function stateManager(game) {
    const privateProps = {
        currentStateIndex: -1,
    };

    const publicProps = {
        game,
    };

    const methods = {
        /**
         * Start state and mark it as the current state
         * @param   {string} name Name of the state in game cache
         * @return  {undefined}
         */
        start(name) {
            const stateName = name || this.nextState();
            const state = game.state.states[stateName];

            if (!state) {
                throw new Error(`Cannot find state ${stateName}!`);
            }

            privateProps.currentStateIndex = getStateIndexByName(stateName);

            console.log('Starting state', stateName, privateProps.currentStateIndex);

            // if the state has a onStateDone signal then start listening to it
            if (state.onStateDone) {
                state.onStateDone.add((nextStateName) => {
                    // the state is inactive, remove all listeners
                    state.onStateDone.removeAll();
                    // start the next state
                    this.start(nextStateName);
                });
            }

            game.state.start(stateName);
        },

        /**
         * Get the next state
         * @private
         * @return  {string} Next state's identifier
         */
        nextState() {
            const nextState = states[privateProps.currentStateIndex + 1];

            if (!nextState) { return null; }

            return nextState.name;
        },
    };

    // load all states to the game
    loadStates(game);

    return Object.assign(
        {},
        publicProps,
        methods,
    );
}
