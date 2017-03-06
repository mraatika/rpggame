import { Signal } from 'phaser';
import commandTypes from '../constants/commandtypes';

const signal = new Signal();

/**
 * Dispatch a command via CommandDispatcher signal
 * @exports
 * @param {Object} command
 * @throws {Error}
 */
export function sendCommand(command) {
    if (!command.type) {
        throw new Error('InvalidArgumentsException: Command type is missing!');
    }

    if (!commandTypes[command.type]) {
        throw new Error('InvalidArgumentsException: Unknown command type!');
    }

    if (process.env.NODE_ENV === 'development') {
        console.log(`%c Command ${command.type}`, 'font-weight: bold; color: #f442df', command);
    }

    signal.dispatch(command);
}

/**
 * A signal that acts as a command dispatcher
 * @exports
 * @type {Phaser.Signal}
 */
export default signal;
