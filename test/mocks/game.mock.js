export default class GameMock {
    constructor() {
        this.rnd = {
            between: (min, max) => {
                return Math.floor(Math.random() * max) + min;
            }
        };

        this.physics = {
            arcade: {
                enable: () => {}
            }
        };
    }
}