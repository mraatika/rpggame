import {Signal} from 'phaser';
import Command from 'commands/command';

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

        super.dispatch(command);
    }
}

export default new CommandDispatcher();

