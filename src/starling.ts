import * as PIXI from 'pixi.js';
import {Vector, randomVector, vectorDistance, vectorSub} from './vector';

export class Starling {
    private static readonly MIN_DISTANCE = 100; // Minimum distance to maintain from other starlings
    private static readonly MAX_SPEED = 1.5; // Maximum speed of the starling
    private static readonly AVOID_FORCE = 0.5; // Force applied to avoid other starlings

    public sprite: PIXI.Sprite;
    public position: Vector;
    public velocity: Vector;

    constructor(texture: PIXI.Texture<PIXI.TextureSource<any>>, x: number, y: number) {
        this.position = new Vector(x, y);
        this.velocity = randomVector();

        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.x = x;
        this.sprite.y = y;
    }

    steer(starlings: Starling[]) {
        let avoidForce: Vector = new Vector(0, 0);

        for (const other of starlings) {
            if (other === this) continue;
        
            // avoid other starlings getting too close
            const distance = vectorDistance(this.position, other.position);
            if (distance < Starling.MIN_DISTANCE) {
                const contribution = vectorSub(this.position, other.position);
                contribution.normalize();
                contribution.scale(Starling.AVOID_FORCE / distance); // Scale by distance to make the force stronger when closer
                avoidForce.add(contribution);
            }
        }

        this.applyForce(avoidForce);

        // Limit the speed
        const speed = this.velocity.length;
        if (speed > Starling.MAX_SPEED) {
            this.velocity.normalize();
            this.velocity.scale(Starling.MAX_SPEED);
        }
        
        this.updatePosition();
    }

    private applyForce(force: Vector) {
        this.velocity.add(force);
    }

    private updatePosition() {
        this.position.add(this.velocity);

        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
        this.sprite.rotation = Math.atan2(this.velocity.y, this.velocity.x);
    }
}