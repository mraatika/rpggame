import BootState from './bootstate';
import LoadingState from './loadingstate';
import WorldMapState from './worldmapstate';

export default [
    {
        name: BootState.name,
        stateClass: BootState,
    },
    {
        name: LoadingState.name,
        stateClass: LoadingState,
    },
    {
        name: WorldMapState.name,
        stateClass: WorldMapState,
    },
];
