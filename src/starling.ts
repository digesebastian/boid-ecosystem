import * as PIXI from 'pixi.js';
import {Vector, randomVector} from './vector';

export class Starling {
    public sprite: PIXI.Sprite;
    private velocity: Vector;

    constructor(texture: PIXI.Texture<PIXI.TextureSource<any>>, x: number, y: number) {
        this.velocity = new Vector(x, y);
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.x = x;
        this.sprite.y = y;

        this.velocity = randomVector();
    }

    update() {
        this.sprite.x += this.velocity.x
        this.sprite.y += this.velocity.y
    }
}