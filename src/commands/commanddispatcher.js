import {Signal} from 'phaser';
import Command from 'commands/command';
import Commands from 'commands/commands';

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

    /**
     * Dispatch a move command
     * @param  {Actor} actor Actor moving
     * @param  {Phaser.Point[]} path
     */
    move(actor, path) {
        this.dispatch(new Commands.MoveCommand({ actor, path }));
    }

    /**
     * Dispatch an attack command
     * @param  {Actor} actor The attacking actor
     * @param  {Actor} target The defending actor
     */
    attack(actor, target) {
        this.dispatch(new Commands.AttackCommand({ actor, target }));
    }

    /**
     * Dispatch a loot command
     * @param  {Actor} actor
     * @param  {Treasure} treasure
     */
    loot(actor, treasure) {
        this.dispatch(new Commands.LootCommand({ actor, treasure }));
    }

    /**
     * Dispatch an end action command
     * @param  {Actor} actor
     */
    endAction(actor) {
        this.dispatch(new Commands.EndActionCommand({ actor }));
    }
}

export default new CommandDispatcher();

