import createRound from './round';
import createTurn from './turn';

jest.mock('./turn');

describe('Round', () => {
    describe('Initializing', () => {
        it('should have an unique round id starting from 1', () => {
            const r1 = createRound({});
            expect(r1.roundIndex).toBe(1);
            const r2 = createRound({});
            expect(r2.roundIndex).toBe(2);
        });

        it('should throw an error if actors is not an array', () => {
            expect(() => createRound({}, {}, 123)).toThrow('InvalidArgumentsException: Actors is invalid!');
        });
    });

    describe('Starting a round', () => {
        describe('Starting without actors', () => {
            it('should be done if actors array is not given', () => {
                const round = createRound({});
                round.start();
                expect(round.isDone).toBeTruthy();
            });

            it('should be done if actors array is empty', () => {
                const round = createRound({}, []);
                round.start();
                expect(round.isDone).toBeTruthy();
            });
        });

        describe('Starting with actors', () => {
            it('should have as many turns in queue as there are actors', () => {
                const actors = [{ id: 1 }];
                const round = createRound({}, actors);
                expect(round.getTurns().length).toBe(actors.length);
            });

            it('should set the current turn when started', () => {
                const actors = [{ id: 1 }];
                const turn = { start: jest.fn() };
                createTurn.mockReturnValueOnce(turn);

                const round = createRound({}, actors);

                round.start();

                expect(round.turn).toBe(turn);
            });

            it('should start the turn when started', () => {
                const turn = { start: jest.fn() };
                createTurn.mockReturnValueOnce(turn);

                const round = createRound({}, [{ id: 1 }]);
                round.start();

                expect(turn.start).toHaveBeenCalled();
            });

            it('should call turn\'s update method on every update', () => {
                const turn = { start: jest.fn(), update: jest.fn() };
                createTurn.mockReturnValueOnce(turn);

                const round = createRound({}, [{ id: 1 }, { id: 2 }]);
                round.start();

                round.update();
                round.update();

                expect(turn.update).toHaveBeenCalledTimes(2);
            });

            it('should start the next turn after previous turn is done and dispose the old one', () => {
                const firstTurn = { start: jest.fn(), update: jest.fn(), dispose: jest.fn() };
                const secondTurn = { start: jest.fn(), update: jest.fn(), dispose: jest.fn() };

                createTurn
                    .mockReturnValueOnce(firstTurn)
                    .mockReturnValueOnce(secondTurn);


                const round = createRound({}, [{ id: 1 }, { id: 2 }]);

                round.start();

                firstTurn.isDone = true;

                round.update();

                expect(secondTurn.start).toHaveBeenCalled();
                expect(firstTurn.dispose).toHaveBeenCalled();

                expect(round.isDone).toBeFalsy();
            });

            it('should dispatch roundDone event after all turns are done', () => {
                const turn = { start: jest.fn(), update: jest.fn(), dispose: jest.fn() };
                createTurn.mockReturnValueOnce(turn);

                const round = createRound({}, [{ id: 1 }]);
                round.start();

                turn.isDone = true;

                round.update();

                expect(round.isDone).toBeTruthy();
            });
        });
    });
});
