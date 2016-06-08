import sinon from 'sinon';
import {expect} from 'chai';
import Enemy from '../../src/sprites/enemy';
import MapUtils from '../../src/common/maputils';
import TurnPhases from '../../src/common/turnphases';
import CommandDispatcher from '../../src/commands/commanddispatcher';
import Commands from '../../src/commands/commands';

const MovementStrategyMock = function() {};
MovementStrategyMock.prototype.calculatePath = sinon.stub().returns([]);

describe('Enemy', function () {
    let enemy;
    let isOnSurroundingTileStub;
    let sandbox;
    let movementStrategyMock;

    beforeEach(() => {
        enemy = new Enemy({}, 0, 0, {});
        enemy.target = new Enemy();

        sandbox = sinon.sandbox.create();

        isOnSurroundingTileStub = sandbox.stub(MapUtils, 'isOnSurroundingTile');
        sandbox.stub(CommandDispatcher, 'dispatch');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('Deciding an action', function () {

        beforeEach(function () {
            movementStrategyMock = new MovementStrategyMock();
            sinon.stub(enemy, 'getMovementStrategy').returns(movementStrategyMock);
        });

        it('should move when it\'s movement phase and target is not within attack range', function () {
            isOnSurroundingTileStub.returns(false);

            enemy.movementPoints = 2;

            enemy.decideAction({ currentPhase: TurnPhases.MOVE_PHASE });

            expect(CommandDispatcher.dispatch.calledWith(sinon.match.instanceOf(Commands.MoveCommand))).to.be.ok;
            expect(CommandDispatcher.dispatch.calledWith(sinon.match.instanceOf(Commands.EndActionCommand))).not.to.be.ok;
        });

        it('should end action if it\'s movement phase and target is within attack range', function () {
            isOnSurroundingTileStub.returns(true);

            enemy.movementPoints = 2;

            enemy.decideAction({ currentPhase: TurnPhases.MOVE_PHASE });

            expect(CommandDispatcher.dispatch.calledWith(sinon.match.instanceOf(Commands.EndActionCommand))).to.be.ok;
            expect(CommandDispatcher.dispatch.calledWith(sinon.match.instanceOf(Commands.MoveCommand))).not.to.be.ok;
            expect(CommandDispatcher.dispatch.calledWith(sinon.match.instanceOf(Commands.AttackCommand))).not.to.be.ok;
        });

        it('should end action if its move phase and the movement is done (event if there are still movement points left', function () {
            isOnSurroundingTileStub.returns(false);

            enemy.movementPoints = 2;
            movementStrategyMock.isMovementFinished = true;

            enemy.decideAction({ currentPhase: TurnPhases.MOVE_PHASE });

            expect(CommandDispatcher.dispatch.calledWith(sinon.match.instanceOf(Commands.EndActionCommand))).to.be.ok;
            expect(CommandDispatcher.dispatch.calledWith(sinon.match.instanceOf(Commands.MoveCommand))).not.to.be.ok;
        });

        it('should end action if it\'s movement phase but the actor doesn\'t have any more movement points', function () {
            isOnSurroundingTileStub.returns(false);

            enemy.movementPoints = 0;

            enemy.decideAction({ currentPhase: TurnPhases.MOVE_PHASE });

            expect(CommandDispatcher.dispatch.calledWith(sinon.match.instanceOf(Commands.EndActionCommand))).to.be.ok;
            expect(CommandDispatcher.dispatch.calledWith(sinon.match.instanceOf(Commands.MoveCommand))).not.to.be.ok;
        });

        it('should attack when it\'s action phase and target is within attack range', function () {
            isOnSurroundingTileStub.returns(true);

            enemy.decideAction({ currentPhase: TurnPhases.ACTION_PHASE });

            expect(CommandDispatcher.dispatch.calledWith(sinon.match.instanceOf(Commands.AttackCommand))).to.be.ok;
            expect(CommandDispatcher.dispatch.calledWith(sinon.match.instanceOf(Commands.EndActionCommand))).not.to.be.ok;
        });

        it('should end action if its action phase but target is not within attack range', function () {
            isOnSurroundingTileStub.returns(false);

            enemy.decideAction({ currentPhase: TurnPhases.ACTION_PHASE });

            expect(CommandDispatcher.dispatch.calledWith(sinon.match.instanceOf(Commands.EndActionCommand))).to.be.ok;
            expect(CommandDispatcher.dispatch.calledWith(sinon.match.instanceOf(Commands.AttackCommand))).not.to.be.ok;
        });
    });
});