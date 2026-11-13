import * as PIXI from 'pixi.js';
import { Vector } from './vector';

export class Insect {
    public position: Vector;
    public sprite: PIXI.Sprite;

    constructor(
        texture: PIXI.Texture<PIXI.TextureSource<any>>,
        x: number,
        y: number,
    ) {
        this.position = new Vector(x, y);

        this.sprite = new PIXI.Sprite(texture);
        this.sprite.x = x;
        this.sprite.y = y;
    }
}