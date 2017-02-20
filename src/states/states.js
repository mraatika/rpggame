import BootState from './bootstate';
import LoadingState from './loadingstate';
import PlayState from './playstate';

export default [
    {
        name: 'BootState',
        stateClass: BootState,
    },
    {
        name: 'LoadingState',
        stateClass: LoadingState,
    },
    {
        name: 'PlayState',
        stateClass: PlayState,
    },
];
