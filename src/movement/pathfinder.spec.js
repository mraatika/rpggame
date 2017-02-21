import EasyStar from 'easystarjs';
import PathFinder from './pathfinder';

describe('PathFinder', () => {
    describe('initialization', () => {
        it('should create an instance of EasyStar', () => {
            expect(new PathFinder().easyStar).toBeInstanceOf(EasyStar.js);
        });
    });

    describe('setting grid', () => {
        it('should set grid to easystar', () => {
            const grid = [[{ index: 1 }, { index: 1 }, { index: 1 }, { index: 1 }]];
            const map = { getLayerIndex: () => 0, layers: [{ data: grid }] };
            const finder = new PathFinder({ map });

            finder.easyStar.setGrid = jest.fn();
            finder.easyStar.findPath = jest.fn();

            finder.findPath({ x: 0, y: 0 }, { x: 1, y: 1 });

            const firstArgument = finder.easyStar.setGrid.mock.calls[0][0];
            expect(firstArgument).toBeInstanceOf(Array);
            expect(firstArgument.length).toBe(grid.length);
        });

        it('should set acceptable tiles', () => {
            const grid = [[{ index: 1 }, { index: 1 }, { index: 1 }, { index: 1 }]];
            const map = { getLayerIndex: () => 0, layers: [{ data: grid }] };
            const acceptableTiles = [1, 2];
            const finder = new PathFinder({ map, acceptableTiles });

            finder.easyStar.setAcceptableTiles = jest.fn();
            finder.easyStar.findPath = jest.fn();

            finder.findPath({ x: 0, y: 0 }, { x: 1, y: 1 });

            expect(finder.easyStar.setAcceptableTiles).toHaveBeenCalledWith(acceptableTiles);
        });

        it('should default acceptable tiles to -1', () => {
            const grid = [[{ index: 1 }, { index: 1 }, { index: 1 }, { index: 1 }]];
            const map = { getLayerIndex: () => 0, layers: [{ data: grid }] };
            const finder = new PathFinder({ map });

            finder.easyStar.setAcceptableTiles = jest.fn();
            finder.easyStar.findPath = jest.fn();

            finder.findPath({ x: 0, y: 0 }, { x: 1, y: 1 });

            expect(finder.easyStar.setAcceptableTiles).toHaveBeenCalledWith([-1]);
        });
    });

    describe('Setting grid with obstacles', () => {
        it('should mark obstacles as non walkable tiles', () => {
            const grid = [
                [{ index: -1 }, { index: -1 }, { index: -1 }, { index: -1 }],
                [{ index: -1 }, { index: -1 }, { index: -1 }, { index: -1 }],
            ];
            const map = { getLayerIndex: () => 0, layers: [{ data: grid }] };
            const obstacles = [{ position: { x: 16, y: 16 } }, { position: { x: 48, y: 48 } }];
            const finder = new PathFinder({ map, obstacles });
            const expected = [[99, -1, -1, -1], [-1, 99, -1, -1]];

            finder.easyStar.setGrid = jest.fn();
            finder.easyStar.findPath = jest.fn();

            finder.findPath({ x: 0, y: 0 }, { x: 1, y: 1 });

            expect(finder.easyStar.setGrid).toHaveBeenCalledWith(expected);
        });
    });
});
