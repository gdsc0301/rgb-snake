"use strict";
import Food from "./Food";
import Game from "./Game";

class SnakePart {
    x;
    y;
    style;
    parentPlayer;

    /**
     * @param {Number} xPos The relative distance from the Player position in partsSize.
     * @param {Number} yPos The relative distance from the Player position in partsSize.
     * @param {Player} parentPlayer The Player that this part belongs to
     */
    constructor(xPos, yPos, parentPlayer) {
        this.x = xPos;
        this.y = yPos;

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
        PartRect.rect(this.x + 1, this.y + 1, this.parentPlayer.partsSize - 1, this.parentPlayer.partsSize - 1);
        
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
    partsSize = 24;

    tick = 0;
    maxSpeed = 24;

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
            this.parts.push(
                new SnakePart(
                    this.x,
                    this.y + (this.partsSize * i),
                    this
                )
            );
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

        if(this.tick === Math.min(18, this.maxSpeed - Math.floor(this.parts.length / this.maxSpeed))) {
            this.tick = 0;
            this.#walk();
        }
    }

    #walk() {
        const velocity = this.partsSize;

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

        // Sideways walls check
        if(Math.round(this.x / this.partsSize) > this.game.canvasPropWidth) {
            this.x = 0;
        }
        if(this.x < 0) {
            this.x = this.partsSize * this.game.canvasPropWidth;
        }

        // Top / Bottom walls check
        if(Math.round(this.y / this.partsSize) > this.game.canvasPropHeight) {
            this.y = 0;
        }
        if(this.y < 0) {
            this.y = this.partsSize * this.game.canvasPropHeight;
        }

        for(let i = this.parts.length-1; i > 0; i--){
            this.parts[i].setPosition(this.parts[i-1].position);
        }
        
        this.parts[0].setPosition({x: this.x, y: this.y});
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        this.parts.forEach((part, i) => {
            part.style = this.game.GameColors[Object.keys(this.game.GameColors)[i]];
            part.draw(ctx);
        });

        ctx.fillStyle = this.game.GameColors.five;
        ctx.fillText(`${this.username} | ${this.parts.length - 3}`, this.x + this.partsSize + 14, this.y - 14);
    }

    /** @param {Food} thisFood */
    isEating(thisFood) {
        if(
            thisFood.x >= this.x &&
            thisFood.x + thisFood.size <= this.x + this.partsSize
        ) {
            if(
                thisFood.y >= this.y &&
                thisFood.y + thisFood.size <= this.y + this.partsSize
            ) {
                const lastPart = this.parts[this.parts.length - 1];
                this.parts.push(new SnakePart(lastPart.x, lastPart.y, this));
                this.game.levelUp();
            }
        }
    }
}