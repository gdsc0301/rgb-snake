export default class Food {
    x;
    y;
    size;
    style;
    constructor(x,y,size,style) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.style = style;
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        ctx.fillStyle = this.style;
        ctx.fillRect(this.x + 1, this.y + 1, this.size - 1,this.size - 1);
    }
}