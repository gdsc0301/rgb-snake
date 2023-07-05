"use strict";
import Game from "./Game";

class SnakePart {
    x;
    y;
    style;
    parentPlayer;

    /**
     * @param {Number} relativeInitialX The relative distance from the Player position in partsSize.
     * @param {Number} relativeInitialY The relative distance from the Player position in partsSize.
     * @param {Player} parentPlayer The Player that this part belongs to
     */
    constructor(relativeInitialX, relativeInitialY, parentPlayer) {
        this.x = parentPlayer.x + (relativeInitialX + 1) * relativeInitialX;
        this.y = parentPlayer.y + (relativeInitialY + 1) * relativeInitialY;
        this.parentPlayer = parentPlayer;
    }

    /**
     * @param {{x: Number; y: Number}} position 
     */
    setPosition(position){
        this.x = position.x;
        this.y = position.y;
    }

    get position() {
        return {
            x: this.x,
            y: this.y
        };
    }

    /** @param {CanvasRenderingContext2D} ctx  */
    draw(ctx) {
        ctx.fillStyle = this.style;
        const PartRect = new Path2D();
        PartRect.rect(this.x, this.y, this.parentPlayer.partsSize, this.parentPlayer.partsSize);
        
        ctx.fill(PartRect);
    }
}

const Direction = {
    Up: 'ArrowUp',
    Down: 'ArrowDown',
    Left: 'ArrowLeft',
    Right: 'ArrowRight'
};

export default class Player {
    username;
    x;
    y;
    direction;

    game;

    /** @type {Array.<SnakePart>} */
    parts = [];
    partsSize = 10;

    tick = 0;
    maxSpeed = 16;

    /**
     * @param {String} username Player username
     * @param {Number} x 
     * @param {Number} y 
     * @param {Game} game 
     */
    constructor(username, game, x, y) {
        this.username = username;
        this.game = game;

        this.x = x;
        this.y = y;
        this.direction = Direction.Up;

        this.#init();
    }

    #init() {
        for(let i = 0; i < 3; i++) {
            this.parts.push(new SnakePart(0, i, this));
        }

        window.addEventListener('keydown', (event) => this.#handleKeyDown(event));
    }

    /** @param {KeyboardEvent} e */
    #handleKeyDown(e) {
        switch (e.key) {
            case Direction.Up:
                this.direction = Direction.Up;
                break;

            case Direction.Down:
                this.direction = Direction.Down;
                break;

            case Direction.Left:
                console.log('GO TO LEFT');
                this.direction = Direction.Left;
                break;

            case Direction.Right:
                this.direction = Direction.Right;
                break;
        
            default:
                break;
        }
    }

    setPosition(x, y) {
        const offset = {
            x: this.x - x,
            y: this.y - y
        };

        this.x = x;
        this.y = y;
        this.parts.forEach(part => {
            part.x += offset.x;
            part.y += offset.y;
        });
    }

    update() {
        this.tick++;

        if(this.tick === Math.min(10, this.maxSpeed - Math.floor(this.parts.length / this.maxSpeed))) {
            this.tick = 0;
            this.#walk();
        }
    }

    #walk() {
        const velocity = this.partsSize + 1;

        switch (this.direction) {
            case Direction.Up:
                this.y -= velocity;
                break;

            case Direction.Down:
                this.y += velocity;
                break;

            case Direction.Left:
                this.x -= velocity;
                break;

            case Direction.Right:
                this.x += velocity;
                break;
        }

        for(let i = this.parts.length-1; i > 0; i--){
            this.parts[i].setPosition(this.parts[i-1].position);
        }

        this.parts[0].setPosition({x: this.x, y: this.y});
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        ctx.fillStyle = this.game.GameColors.five;
        console.log(this.username);
        ctx.fillText(`${this.username} | ${this.parts.length - 3}`, this.x + this.partsSize + 6, this.y);

        this.parts.forEach((part, i) => {
            part.style = this.game.GameColors[Object.keys(this.game.GameColors)[i]];
            part.draw(ctx);
        })
    }
}