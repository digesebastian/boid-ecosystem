export const lerp = (start: number, end: number, amt: number) => start + (end - start) * amt;

export const lerpAngle = (start: number, end: number, amt: number) => {
    let delta = end - start;
    
    // Normalize the delta to take the shortest path across the boundary
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;
    
    return start + delta * amt;
};