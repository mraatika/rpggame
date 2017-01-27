import sinon from 'sinon';
import {expect} from 'chai';
import Enemy from '../../src/sprites/enemy';
import MapUtils from '../../src/common/maputils';
import TurnPhases from '../../src/common/turnphases';
import CommandDispatcher from '../../src/commands/commanddispatcher';
import Commands from '../../src/commands/commands';
import TurnMock from '../mocks/turn.mock';

const MovementStrategyMock = function() {};
MovementStrategyMock.prototype.calculatePath = sinon.stub().returns([]);

const AttackMovementStrategyMock = function() {};

describe('Enemy', function () {
    let enemy;
    let isOnSurroundingTileStub;
    let sandbox;
    let movementStrategyMock;

    beforeEach(() => {

        Enemy.__Rewire__('AttackMovementStrategy', AttackMovementStrategyMock);
        Enemy.__Rewire__('StandStillMovementStrategy', MovementStrategyMock);
        sandbox = sinon.sandbox.create();

        // prevent from calling Phaser add.bitmapdata etc. methods
        sandbox.stub(Enemy.prototype, '_createHealthBar');

        enemy = new Enemy({}, 0, 0, {});
        enemy.target = new Enemy();

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

    describe('Deciding a movement strategy', function () {
        it('should move towards an attacking position when aggro level is > 0', function () {
            enemy.aggroLevel = 1;

            const strategy = enemy.getMovementStrategy(new TurnMock());

            expect(strategy).to.be.instanceOf(AttackMovementStrategyMock);
        });

        it('should use it\'s default strategy if aggro is 0', function () {
            const strategy = enemy.getMovementStrategy(new TurnMock());
            expect(strategy).to.be.instanceOf(MovementStrategyMock);
        });
    });

    describe('Aggro', function () {
        it('should have initial aggro level of 0', function () {
            expect(enemy.aggroLevel).to.equal(0);
        });

        it('should reduce aggro level', function () {
            const level = 10;
            enemy.aggroLevel = level;

            enemy.updateAggroLevel(-1);

            expect(enemy.aggroLevel).to.equal(level - 1);
        });

        it('should increase aggro level', function () {
            const level = 10;
            enemy.updateAggroLevel(level);
            expect(enemy.aggroLevel).to.equal(level);
        });

        it('should not reduce aggro level if it\'s zero', function () {
            enemy.updateAggroLevel(-1);
            expect(enemy.aggroLevel).to.equal(0);
        });
    });
});