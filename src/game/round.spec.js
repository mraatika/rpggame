import Round from './round';

jest.mock('./turn');

describe('Round', () => {
    describe('Initializing', () => {
        it('should have an unique round id starting from 1', () => {
            const r1 = new Round({});
            expect(r1.roundIndex).toBe(1);
            const r2 = new Round({});
            expect(r2.roundIndex).toBe(2);
        });

        it('should throw an error if actors is not an array', () => {
            expect(() => new Round({}, {}, 123)).toThrow('InvalidArgumentsException: Actors is invalid!');
        });
    });

    describe('Starting a round', () => {
        describe('Starting without actors', () => {
            it('should be done if actors array is not given', () => {
                const round = new Round({});
                round.start();
                expect(round.isDone).toBeTruthy();
            });

            it('should be done if actors array is empty', () => {
                const round = new Round({}, []);
                round.start();
                expect(round.isDone).toBeTruthy();
            });
        });

        describe('Starting with actors', () => {
            let round;
            let actors;

            beforeEach(() => {
                actors = [
                    { id: 1 },
                    { id: 2 },
                ];

                round = new Round({}, actors);
            });

            it('should have as many turns in queue as there are actors', () => {
                expect(round.queue.size()).toBe(actors.length);
            });

            it('should set the current turn when started', () => {
                const firstTurn = round.queue.peek();

                round.start();

                expect(round.turn).toBe(firstTurn);
            });

            it('should start the turn when started', () => {
                const firstTurn = round.queue.peek();

                round.start();

                expect(firstTurn.start).toHaveBeenCalled();
            });

            it('should call turn\'s update method on every update', () => {
                const firstTurn = round.queue.peek();

                round.start();

                round.update();
                round.update();

                expect(firstTurn.update).toHaveBeenCalledTimes(2);
            });

            it('should start the next turn after previous turn is done and dispose the old one', () => {
                const firstTurn = round.queue.entries[0];
                const secondTurn = round.queue.entries[1];

                round.start();

                firstTurn.isDone = true;

                round.update();

                expect(secondTurn.start).toHaveBeenCalled();
                expect(firstTurn.dispose).toHaveBeenCalled();

                expect(round.isDone).toBeFalsy();
            });

            it('should dispatch roundDone event after all turns are done', () => {
                round.queue.remove();

                const lastTurn = round.queue.peek();

                round.start();

                lastTurn.isDone = true;

                round.update();

                expect(round.isDone).toBeTruthy();
            });
        });
    });
});
