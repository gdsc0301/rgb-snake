"use strict";
import Player from "./Player";

export default class Game {
    initialTime;
    time;
    score = 0;

    player;

    /** @type {HTMLCanvasElement} */
    canvas;
    /** @type {CanvasRenderingContext2D} */
    ctx;
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

        this.player = new Player(username, this, this.canvas.width / 2, this.canvas.height / 2);

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
        this.time = 'Time: ' + (new Date(Date.now() - this.initialTime.getMilliseconds()).toLocaleString('en', { dateStyle: 'medium' }));
        this.player.update();
        this.draw();
    }

    draw() {
        this.#fillStyle('black');
        this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);

        this.#fillStyle(this.GameColors.three);
        this.ctx.fillText(this.time, 16, 16);

        this.player.draw(this.ctx);
    }

    #fillStyle(style) {
        this.ctx.fillStyle = style;
    }

    #strokeStyle(style) {
        this.ctx.strokeStyle = style;
    }
}