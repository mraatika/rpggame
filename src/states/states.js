import BootState from './bootstate';
import LoadingState from './loadingstate';
import PlayState from './playstate';

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
        name: PlayState.name,
        stateClass: PlayState,
    },
];
