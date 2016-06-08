import {expect} from 'chai';
import CommandTypes from 'commands/commandtypes';
import MoveCommand from '../../src/commands/movecommand';
import {Sprite} from 'phaser';


describe('MoveCommand', function () {
    describe('Initialization', function () {
        it('should be of type MOVE_COMMAND', function () {
            const command = new MoveCommand(new Sprite(), []);
            expect(command.type).to.equal(CommandTypes.MOVE_COMMAND);
        });
    });

    describe('Validation', function () {
        it('should not require a path', function () {
            expect(() => {
                new MoveCommand(new Sprite());
            }).not.to.throw();
        });

        it('should require path to be an array if a value is given', function () {
            expect(() => {
                new MoveCommand(new Sprite(), 1);
            }).to.throw();
        });

        it('should require an actor', function () {
            expect(() => {
                new MoveCommand([]);
            }).to.throw();
        });

        it('should require an actor to be an instance of Sprite', function () {
            expect(() => {
                new MoveCommand(function() {}, []);
            }).to.throw();
        });

        it('should not throw an error if all values are valid', function () {
            expect(() => {
                new MoveCommand(new Sprite(), []);
            }).not.to.throw();
        });
    });
});