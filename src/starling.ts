import * as PIXI from 'pixi.js';
import {Vector, randomVector, zeroVector, vectorDistance, vectorSub} from './vector';
import { lerp } from './helperFunctions';

export class Starling {
    private static readonly AVOID_DISTANCE = 50; // Minimum distance to maintain from other starlings
    private static readonly AVOID_FORCE = 0.5; // Force applied to avoid other starlings

    private static readonly ALIGN_DISTANCE = 100; // Distance within which to align with other starlings

    private static readonly MAX_SPEED = 1; // Maximum speed of the starling
    private static readonly ROTATION_SPEED = 0.1; // Maximum steering force applied to the starling

    public sprite: PIXI.Sprite;
    public position: Vector;
    public velocity: Vector;
    private acceleration: Vector;

    constructor(texture: PIXI.Texture<PIXI.TextureSource<any>>, x: number, y: number) {
        this.position = new Vector(x, y);
        this.velocity = randomVector();
        this.acceleration = zeroVector();

        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.rotation = Math.atan2(this.velocity.y, this.velocity.x);
    }

    steer(starlings: Starling[]) {
        let avoidForce: Vector = zeroVector();
        let alignForce: Vector = zeroVector();

        for (const other of starlings) {
            if (other === this) continue;
        
            const distance = vectorDistance(this.position, other.position);
            
            // avoid other starlings getting too close
            if (distance < Starling.AVOID_DISTANCE) {
                const contribution = vectorSub(this.position, other.position);
                contribution.normalize();
                contribution.scale(Starling.AVOID_FORCE); // Scale by distance to make the force stronger when closer
                avoidForce.add(contribution);
            }

            // align with nearby starlings
            if (distance < Starling.ALIGN_DISTANCE) {
                const alignment = vectorSub(other.velocity, this.velocity);
                alignForce.add(alignment);
            }

        }

        this.applyForce(avoidForce);
        this.applyForce(alignForce);

        // Limit the speed
        const speed = this.velocity.length;
        if (speed > Starling.MAX_SPEED) {
            this.velocity.normalize();
            this.velocity.scale(Starling.MAX_SPEED);
        }
        
        this.updatePosition();
    }

    private applyForce(force: Vector) {
        this.acceleration.add(force);
    }

    private updatePosition() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);

        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
        const targetAngle = Math.atan2(this.velocity.y, this.velocity.x);
        this.sprite.rotation = lerp(this.sprite.rotation, targetAngle, Starling.ROTATION_SPEED);
        this.acceleration = zeroVector(); // Reset acceleration
    }
}