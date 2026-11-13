import { Renderer, Texture, TextureSource, Graphics, FillGradient } from "pixi.js";
import { Theme } from "./colorTheme";

export function createStarlingTexture(renderer: Renderer): Texture<TextureSource<any>> {
  // Create starling texture
  const starlingGraphics = new Graphics()
  .poly([
        { x: 0, y: 0 },
        { x: 50, y: 20 },
        { x: 0, y: 40 },
        { x: 8, y: 20 }
    ], true)
    .stroke({
        width: 2,
        color: Theme.starling3
    })
    .fill(starlingGradient)
    ;

  const starlingTexture = renderer.generateTexture(starlingGraphics);
  return starlingTexture;
}   

const starlingGradient = new FillGradient({
    type: 'radial',
    center: { x: 0.5, y: 0.5 },
    innerRadius: 0,
    outerCenter: { x: 0.5, y: 0.5 },
    outerRadius: 0.4,
    colorStops: [
        { offset: 0, color: Theme.starling1 }, // Center color
        { offset: 1, color: Theme.starling2 }   // Edge color
    ],
    // Use normalized coordinate system where (0,0) is the top-left and (1,1) is the bottom-right of the shape
    textureSpace: 'local'
});

export function createInsectTexture(renderer: Renderer): Texture<TextureSource<any>> {
    const insectGraphics = new Graphics()
    .circle(0,0,1)
    .stroke({
        width: 1,
        color: '#ffffff'
    });
    
    const insectTexture = renderer.generateTexture(insectGraphics);
    return insectTexture; 
}