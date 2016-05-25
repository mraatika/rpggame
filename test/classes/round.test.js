import {expect} from 'chai';
import sinon from 'sinon';
import Round from '../../src/classes/round';
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
            it('should dispatch roundDone event if actors is undefined', function () {
                const round = new Round({}, {});
                round.start();
                expect(SignalMock.prototype.dispatch.called).to.be.ok;
            });

            it('should dispatch roundDone event if actors is empty', function () {
                const round = new Round({}, {}, []);
                round.start();
                expect(SignalMock.prototype.dispatch.called).to.be.ok;
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

                round = new Round({}, {}, actors);
            });

            it('should have as many turns in queue as there are actors', function () {
                expect(round.queue.size()).to.equal(actors.length);
            });

            it('should set the current turn when started', function () {
                const firstTurn = round.queue.peek();

                round.start();

                expect(round.currentTurn).to.equal(firstTurn);
            });

            it('should start the turn when started', function () {
                const firstTurn = round.queue.peek();
                sinon.spy(firstTurn, 'start');

                round.start();

                expect(firstTurn.start.called).to.be.ok;
            });

            it('should start the next turn after previous turn is done', function () {
                const firstTurn = round.queue.peek();
                sinon.spy(TurnMock.prototype, 'start');

                firstTurn.turnDone.add.callsArg(0);

                round.start();

                expect(TurnMock.prototype.start.callCount).to.equal(2);
            });

            it('should dispatch roundDone event after all turns are done', function () {
                const firstTurn = round.queue.peek();
                firstTurn.turnDone.add.callsArg(0);

                round.start();

                expect(round.roundDone.dispatch.called).to.equal(true);
            });
        });
    });
});