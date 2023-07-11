"use strict";
import Food from "./Food";
import Player from "./Player";

export default class Game {
    initialTime;
    time;
    score = 0;

    player;
    /** @type {Food} */
    food;

    /** @type {HTMLCanvasElement} */
    canvas;
    /** @type {CanvasRenderingContext2D} */
    ctx;

    actorsSize;
    canvasPropWidth;
    canvasPropHeight;

    gameLoop;

    GameColors = {
        one: '#591202',
        two: '#F28157',
        three: '#BF4904',
        four: '#03A6A6',
        five: '#04D9D9'
    };

    constructor(username, canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        this.actorsSize = 24;
        this.canvasPropWidth = Math.round(this.canvas.width / this.actorsSize);
        this.canvasPropHeight = Math.round(this.canvas.height / this.actorsSize);

        const playerInitPos = {
            x: Math.round(Math.random() * this.canvasPropWidth) * this.actorsSize,
            y: Math.round(Math.random() * this.canvasPropHeight) * this.actorsSize
        };
        this.player = new Player(username, this, playerInitPos.x, playerInitPos.y);

        this.#newFood();

        this.initialTime = new Date();
    }

    init() {
        if(this.player){
            this.gameLoop = setInterval(()=>this.update(), 1000/100);
            return true;
        }else{
            return false;
        }
    }

    stop() {
        clearInterval(this.gameLoop);
    }

    update() {
        this.player.update();
        this.player.isEating(this.food);

        this.time = 'Time: ' + (new Date(Date.now() - this.initialTime.getMilliseconds()).toLocaleString('en', { dateStyle: 'medium' }));
        this.draw();
    }

    draw() {
        this.#fillStyle('black');
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

        this.#fillStyle(this.GameColors.three);
        this.ctx.fillText(this.time, 16, 16);

        this.player.draw(this.ctx);
        this.food.draw(this.ctx);
    }

    #fillStyle(style) {
        this.ctx.fillStyle = style;
    }

    #strokeStyle(style) {
        this.ctx.strokeStyle = style;
    }

    levelUp() {
        this.score++;
        this.#newFood();
    }

    #newFood() {
        const foodInitPos = {
            x: Math.round(Math.random() * this.canvasPropWidth) * this.actorsSize,
            y: Math.round(Math.random() * this.canvasPropHeight) * this.actorsSize
        };
        this.food = new Food(foodInitPos.x, foodInitPos.y, this.actorsSize, this.GameColors.five);
    }
}