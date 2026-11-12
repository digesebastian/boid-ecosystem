import * as PIXI from 'pixi.js';
import { Vector, randomVector, zeroVector, vectorDistance, vectorSub } from './vector';
import { DebugTheme } from './colorTheme';

export class Starling {
    private static readonly AVOID_DISTANCE = 30; // Minimum distance to maintain from other starlings
    private static readonly AVOID_FORCE = 0.03; // Maximum force applied to avoid other starlings

    private static readonly ALIGN_DISTANCE = 100; // Distance within which to align with other starlings
    private static readonly ALIGN_FORCE = 0.01; // Maximum force applied to align with other starlings

    private static readonly BORDER_AVOID_DISTANCE = 10; // Distance from the border to start avoiding
    private static readonly BORDER_AVOID_FORCE = 0.02; // Force applied to avoid the border

    private static readonly MAX_SPEED = 1; // Maximum speed of the starling

    public sprite: PIXI.Sprite;
    public position: Vector;
    public velocity: Vector;
    private acceleration: Vector;

    private avoidForce: Vector = zeroVector();
    private alignmentForce: Vector = zeroVector();
    private borderAvoidForce: Vector = zeroVector();

    private screenWidth: number;
    private screenHeight: number;

    private debugGraphics: PIXI.Graphics; // Optional graphics object for debug drawing

    constructor(
        texture: PIXI.Texture<PIXI.TextureSource<any>>,
        x: number,
        y: number,
        screenWidth: number,
        screenHeight: number,
        debugGraphics: PIXI.Graphics) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.debugGraphics = debugGraphics;

        this.position = new Vector(x, y);
        this.velocity = randomVector();
        this.acceleration = zeroVector();

        this.sprite = new PIXI.Sprite(texture);
        this.sprite.scale.set(0.5); // Scale down the sprite for better visibility
        this.sprite.anchor.set(0.5); // Set the anchor to the center of the sprite for proper rotation
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.rotation = Math.atan2(this.velocity.y, this.velocity.x);
    }

    steer(starlings: Starling[]) {
        this.avoidForce = zeroVector();
        this.alignmentForce = zeroVector();
        this.borderAvoidForce = zeroVector();

        let alignmentGroupCount = 0;
        const alignmentGroupVelocity = zeroVector();

        for (const other of starlings) {
            if (other === this) continue;

            const distance = vectorDistance(this.position, other.position);

            // avoid other starlings getting too close
            if (distance < Starling.AVOID_DISTANCE) {
                const contribution = vectorSub(this.position, other.position);
                contribution.normalize();
                contribution.scale(1 / distance); // divide by distance to make the force stronger when closer
                this.avoidForce.add(contribution);
            }

            // align with nearby starlings
            if (distance < Starling.ALIGN_DISTANCE) {
                alignmentGroupCount++;
                alignmentGroupVelocity.add(other.velocity);
            }
        }

        if (alignmentGroupCount > 0) {
            alignmentGroupVelocity.scale(1 / alignmentGroupCount); // Average the velocities
            alignmentGroupVelocity.normalize();
            alignmentGroupVelocity.scale(Starling.MAX_SPEED); // Scale to max speed
            this.alignmentForce = vectorSub(alignmentGroupVelocity, this.velocity);
        }

        this.borderAvoidForce = this.computeBorderAvoidanceForce();
        this.borderAvoidForce.limit(Starling.BORDER_AVOID_FORCE); // Limit the border avoidance force
        this.applyForce(this.borderAvoidForce);

        this.avoidForce.limit(Starling.AVOID_FORCE); // Limit the avoidance force
        this.applyForce(this.avoidForce);

        this.alignmentForce.limit(Starling.ALIGN_FORCE); // Limit the alignment force
        this.applyForce(this.alignmentForce);

        this.updatePosition();
    }

    private computeBorderAvoidanceForce(): Vector {
        const avoidForce = zeroVector();

        if (this.position.x < Starling.BORDER_AVOID_DISTANCE) {
            avoidForce.add(new Vector(1, 0));
        }
        if (this.position.x > this.screenWidth - Starling.BORDER_AVOID_DISTANCE) {
            avoidForce.add(new Vector(-1, 0));
        }
        if (this.position.y < Starling.BORDER_AVOID_DISTANCE) {
            avoidForce.add(new Vector(0, 1));
        }
        if (this.position.y > this.screenHeight - Starling.BORDER_AVOID_DISTANCE) {
            avoidForce.add(new Vector(0, -1));
        }
        return avoidForce;
    }

    public drawDebug() {
        if (!this.debugGraphics) return;
        this.debugGraphics.setStrokeStyle({width: 2, color: DebugTheme.velocityLine});
        this.debugGraphics.moveTo(this.position.x, this.position.y);
        this.debugGraphics.lineTo(this.position.x + this.velocity.x * 50, this.position.y + this.velocity.y * 50);
        this.debugGraphics.stroke();

        this.debugGraphics.setStrokeStyle({width: 2, color: DebugTheme.avoidLine});
        this.debugGraphics.moveTo(this.position.x, this.position.y);
        this.debugGraphics.lineTo(this.position.x + this.avoidForce.x * 4000, this.position.y + this.avoidForce.y * 4000);
        this.debugGraphics.stroke();
        this.debugGraphics.circle(this.position.x, this.position.y, Starling.AVOID_DISTANCE);
        this.debugGraphics.stroke();

        this.debugGraphics.setStrokeStyle({width: 2, color: DebugTheme.alignmentLine});
        this.debugGraphics.moveTo(this.position.x, this.position.y);
        this.debugGraphics.lineTo(this.position.x + this.alignmentForce.x * 4000, this.position.y + this.alignmentForce.y * 4000);
        this.debugGraphics.stroke();

        this.debugGraphics.setStrokeStyle({width: 2, color: DebugTheme.borderAvoidLine});
        this.debugGraphics.moveTo(this.position.x, this.position.y);
        this.debugGraphics.lineTo(this.position.x + this.borderAvoidForce.x * 4000, this.position.y + this.borderAvoidForce.y * 4000);
        this.debugGraphics.stroke();
    }

    private applyForce(force: Vector) {
        this.acceleration.add(force);
    }

    private updatePosition() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(Starling.MAX_SPEED); // Limit the speed to the maximum speed
        this.position.add(this.velocity);

        this.sprite.x = this.position.x;
        this.sprite.y = this.position.y;
        const targetAngle = Math.atan2(this.velocity.y, this.velocity.x);
        this.sprite.rotation = targetAngle;
        this.acceleration = zeroVector(); // Reset acceleration
    }
}