(function(global) {

    global.Phaser = {};

    global.Phaser.Sprite = function() {};
    global.Phaser.Sprite.prototype = {
        anchor: {
            set: function() {}
        }
    };

    global.Phaser.Signal = function() {};
    global.Phaser.Signal.prototype = {
        add: function() {},
        dispatch: function() {}
    };

    global.Phaser.Point = function() {};

}(this));