(function(global) {
    var PIXI = require('phaser-ce/build/custom/pixi.js');
    window.PIXI = PIXI;
    // because of annoying vue "tips" >x(
    console.info = () => {};
}(this));
