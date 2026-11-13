import * as PIXI from 'pixi.js';
import { Vector } from './vector';
import { Theme } from './colorTheme';
import { randomEntry } from './helperFunctions';

export class Insect {
    public position: Vector;
    public sprite: PIXI.Sprite;

    constructor(
        texture: PIXI.Texture<PIXI.TextureSource<any>>,
        x: number,
        y: number,
    ) {
        const xPos = Math.round(x);
        const yPos = Math.round(y);

        this.position = new Vector(xPos, yPos);

        this.sprite = new PIXI.Sprite(texture);
        const insectColors: PIXI.ColorSource[] = [Theme.insect1, Theme.insect2, Theme.insect3];
        const randomColor = randomEntry(insectColors);
        console.log('Created insect with color: '+randomColor);
        this.sprite.tint = randomColor;
        this.sprite.x = xPos;
        this.sprite.y = yPos;
    }
}
