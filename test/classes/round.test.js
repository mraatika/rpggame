import {expect} from 'chai';
import sinon from 'sinon';
import Round from '../../src/common/round';
import SignalMock from '../mocks/signal.mock';
import TurnMock from '../mocks/turn.mock';

describe('Round', function () {
    beforeEach(function () {
        Round.__Rewire__('Signal', SignalMock);
        Round.__Rewire__('Turn', TurnMock);
    });

    describe('Initializing', function () {
        it('should have an unique round id starting from 1', function () {
            const r1 = new Round({});
            expect(r1.roundIndex).to.equal(1);
            const r2 = new Round({});
            expect(r2.roundIndex).to.equal(2);
        });

        it('should throw an error if actors is not an array', function () {
            expect(() => {
                new Round({}, {}, 123);
            }).to.throw('InvalidArgumentsException: Actors is invalid!');
        });
    });

    describe('Starting a round', function () {
        describe('Starting without actors', function () {
            it('should be done if actors array is not given', function () {
                const round = new Round({});
                round.start();
                expect(round.isDone).to.be.ok;
            });

            it('should be done if actors array is empty', function () {
                const round = new Round({}, []);
                round.start();
                expect(round.isDone).to.be.ok;
            });
        });

        describe('Starting with actors', function () {
            let round;
            let actors;

            beforeEach(() => {
                actors = [
                    { id: 1 },
                    { id: 2 }
                ];

                round = new Round({}, actors);
            });

            it('should have as many turns in queue as there are actors', function () {
                expect(round.queue.size()).to.equal(actors.length);
            });

            it('should set the current turn when started', function () {
                const firstTurn = round.queue.peek();

                round.start();

                expect(round.turn).to.equal(firstTurn);
            });

            it('should start the turn when started', function () {
                const firstTurn = round.queue.peek();
                sinon.spy(firstTurn, 'start');

                round.start();

                expect(firstTurn.start.called).to.be.ok;
            });

            it('should call turn\'s update method on every update', function () {
                const firstTurn = round.queue.peek();
                sinon.spy(firstTurn, 'update');

                round.start();

                round.update();
                round.update();

                expect(firstTurn.update.callCount).to.equal(2);
            });

            it('should start the next turn after previous turn is done and dispose the old one', function () {
                const firstTurn = round.queue.container[0];
                const secondTurn = round.queue.container[1];

                sinon.spy(secondTurn, 'start');
                sinon.spy(firstTurn, 'dispose');

                round.start();

                firstTurn.isDone = true;

                round.update();

                expect(secondTurn.start.called).to.be.ok;
                expect(firstTurn.dispose.called).to.be.ok;

                expect(round.isDone).not.to.be.ok;
            });

            it('should dispatch roundDone event after all turns are done', function () {
                round.queue.remove();

                const lastTurn = round.queue.peek();

                round.start();

                lastTurn.isDone = true;

                round.update();

                expect(round.isDone).to.be.ok;
            });
        });
    });
});