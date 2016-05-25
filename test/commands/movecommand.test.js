import {expect} from 'chai';
import CommandTypes from 'commands/commandtypes';
import MoveCommand from '../../src/commands/movecommand';
import {Sprite} from 'phaser';


describe('MoveCommand', function () {
    describe('Initialization', function () {
        it('should be of type MOVE_COMMAND', function () {
            const command = new MoveCommand({ actor: new Sprite(), path: [] });
            expect(command.type).to.equal(CommandTypes.MOVE_COMMAND);
        });
    });

    describe('Validation', function () {
        it('should require a path', function () {
            expect(() => {
                new MoveCommand({ actor: new Sprite() });
            }).to.throw();
        });

        it('should require path to be an array', function () {
            expect(() => {
                new MoveCommand({ actor: new Sprite(), path: 1 });
            }).to.throw();
        });

        it('should require an actor', function () {
            expect(() => {
                new MoveCommand({ path: [] });
            }).to.throw();
        });

        it('should require an actor to be an instance of Sprite', function () {
            expect(() => {
                new MoveCommand({ actor: function() {}, path: [] });
            }).to.throw();
        });

        it('should not throw an error if all values are valid', function () {
            expect(() => {
                new MoveCommand({ actor: new Sprite(), path: [] });
            }).not.to.throw();
        });
    });
});