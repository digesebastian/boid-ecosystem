export class Vector {
    public x;
    public y;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize(): void {
        if (this.length === 0) {
            return; // cannot normalize a zero-length vector
        }

        this.x /= this.length;
        this.y /= this.length;
    }

    add(other: Vector): void {
        this.x += other.x;
        this.y += other.y;
    }

    sub(other: Vector): void {
        this.x -= other.x;
        this.y -= other.y;
    }

    scale(scalar: number): void {
        this.x *= scalar;
        this.y *= scalar;
    }
}

export function vectorDistance(v1: Vector, v2: Vector): number {
    const dx = v1.x - v2.x;
    const dy = v1.y - v2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export function vectorAdd(v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
}


export function vectorSub(v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
}


export function randomVector(): Vector {
    // Generate a random angle between 0 and 2π
    const angle = Math.random() * Math.PI * 2;
    // Create the random direction vector
    const x = Math.cos(angle);
    const y = Math.sin(angle);

    return new Vector(x,y);
}