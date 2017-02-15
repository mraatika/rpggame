import { Easing, Sprite } from 'phaser';

const WIDTH = 50;
const HEIGHT = 10;
const BG_COLOR = 0x00685E;
const FILL_COLOR = 0x00F910;
const HEALTH_TEXT_BG_RADIUS = 20;
const HEALTH_TEXT_BG_LINE_WIDTH = 2;
const HEALTH_TEXT_FONT = { font: 'bold 12px Arial', fill: '#ffffff' };

export default class HealthBar extends Sprite {
    /**
     * @constructor
     * @param       {Phaser.Game} game
     * @param       {Actor} actor
     * @param       {Number} health
     */
    constructor(game, yOffset, health) {
        super(game, 0, 0);
        this.maxHealth = health;
        this.yOffset = yOffset;
    }

    /**
     * Draw the health bar
     * @return {HealthBar} this
     */
    draw() {
        const barX = -(WIDTH / 1.5);
        const barY = -this.yOffset;

        // create health bar background
        this.createAndAddHealthBar(barX, barY, BG_COLOR);

        // create the actual health bar
        this.healthBar = this.createAndAddHealthBar(barX, barY, FILL_COLOR);

        // create background for the current health text
        const healthTextBg = this.createAndAddHealthTextBackground(barX, barY);

        // create the current health text
        this.healthText = this.createAndAddHealthText(healthTextBg.x, healthTextBg.y);

        return this;
    }
    /**
     * Create health bar of given color and add it as a child
     * @param  {Number} x
     * @param  {Number} y
     * @param  {Number} color
     * @return {Phaser.Graphics}
     */
    createAndAddHealthBar(x, y, color) {
        const bar = this.game.make.graphics(x, y);
        bar.beginFill(color);
        bar.drawRect(0, 0, WIDTH, HEIGHT);

        this.addChild(bar);

        return bar;
    }
    /**
     * Create text that displays the actor's current health and add it as a child
     * @param  {Number} x
     * @param  {Number} y
     * @return {Phaser.Text}
     */
    createAndAddHealthText(x, y) {
        const text = this.game.make.text(
            x - 3,
            y - 6.5,
            this.maxHealth,
            HEALTH_TEXT_FONT,
        );

        this.addChild(text);

        return text;
    }
    /**
     * Create background for the health text and add it as a child
     * @param  {Number} x
     * @param  {Number} y
     * @return {Phaser.Graphics}
     */
    createAndAddHealthTextBackground(x, y) {
        const bg = this.game.make.graphics((-1 * x) - 7, y + 5);

        bg.beginFill(BG_COLOR);
        bg.lineStyle(HEALTH_TEXT_BG_LINE_WIDTH, FILL_COLOR);
        bg.drawCircle(0, 0, HEALTH_TEXT_BG_RADIUS);

        this.addChild(bg);

        return bg;
    }

    /**
     * Reduce health bar's width to display current health
     */
    animateUpdate(health) {
        const step = WIDTH / this.maxHealth;

        this.healthText.text = health;

        this.game.add.tween(this.healthBar)
            .to({ width: health * step }, 200, Easing.Linear.None, true);
    }
}
