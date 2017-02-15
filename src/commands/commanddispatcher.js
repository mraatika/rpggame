import { Signal } from 'phaser';
import Command from './command';

/**
 * @class CommandDispatcher
 * @description A singleton dispatcher for commands
 * @extends Signal
 * @singleton
 */
class CommandDispatcher extends Signal {
    /**
     * Dispatch a command
     * @param  {Command} command
     */
    dispatch(command) {
        // only dispatch commands
        if (!(command instanceof Command)) {
            throw new Error('Cannot dispatch command: Not instance of Command class!');
        }

        if (process.env.NODE_ENV === 'development') {
            console.log(`%c Command ${command.type}`, 'font-weight: bold; color: #f442df', command);
        }

        super.dispatch(command);
    }
}

export default new CommandDispatcher();
