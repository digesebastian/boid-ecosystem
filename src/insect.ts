import * as PIXI from 'pixi.js';
import { Vector } from './vector';
import { Theme } from './colorTheme';
import { randomEntry } from './helperFunctions';
import { Settings } from './settings';

export class Insect {
    public position: Vector;
    public sprite: PIXI.Sprite;
    
    private lifetime: number;

    constructor(
        texture: PIXI.Texture<PIXI.TextureSource<any>>,
        x: number,
        y: number
    ) {
        const xPos = Math.round(x);
        const yPos = Math.round(y);
        this.position = new Vector(xPos, yPos);

        this.lifetime = this.calculateLifetime();

        this.sprite = new PIXI.Sprite(texture);
        const insectColors: PIXI.ColorSource[] = [Theme.insect1, Theme.insect2, Theme.insect3];
        const randomColor = randomEntry(insectColors);
        console.log('Created insect with color: '+randomColor + 'and lifetime: ' + this.lifetime);
        this.sprite.tint = randomColor;
        this.sprite.x = xPos;
        this.sprite.y = yPos;
    }

    private calculateLifetime(): number {
        return Settings.INSECT_LIFETIME_MIN + Math.random() * (Settings.INSECT_LIFETIME_MAX-Settings.INSECT_LIFETIME_MIN)
    }

    update(insects: Insect[], ownIndex: number) {
        this.lifetime--
        if (this.lifetime <= 0) {
            console.log("killing insect: " + ownIndex + ' new length: ' + insects.length);
            this.sprite.destroy();
            insects.splice(ownIndex, 1)
        }
    }
}
