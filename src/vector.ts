export class Vector {
    public x;
    public y;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export function randomVector(): Vector {
    // Generate a random angle between 0 and 2π
    const angle = Math.random() * Math.PI * 2;
    // Create the random direction vector
    const x = Math.cos(angle);
    const y = Math.sin(angle);

    return new Vector(x,y);
}