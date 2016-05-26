import {Signal} from 'phaser';
import CommandTypes from 'commands/commandtypes';

/**
 * @class CommandEmitter
 * @description An emitter class for commands
 * @extends Signal
 * @singleton
 */
class CommandEmitter extends Signal {
    /**
     * Dispatch a command
     * @param  {Command} command
     * @return {undefined}
     */
    dispatch(command) {
        this._logCommand(command);
        super.dispatch(command);
    }

    _logCommand(command) {
        switch (command.type) {
        case CommandTypes.MOVE_COMMAND:
            {
                const lastPoint = command.path[command.path.length - 1];
                console.log(`${command.actor.name} is moving to ${lastPoint.x},${lastPoint.y}`);
                break;
            }
        }
    }
}

export default new CommandEmitter();

