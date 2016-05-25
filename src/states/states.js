import BootState from 'states/bootstate';
import LoadingState from 'states/loadingstate';
import WorldMapState from 'states/worldmapstate';

export default [
    {
        name: BootState.name,
        stateClass: BootState
    },
    {
        name: LoadingState.name,
        stateClass: LoadingState
    },
    {
        name: WorldMapState.name,
        stateClass: WorldMapState
    }
];