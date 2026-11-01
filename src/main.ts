import { Application, Assets, Sprite, Graphics } from "pixi.js";
import { Starling } from "./starling";
import { createStarlingTexture } from "./textureFactory";
import { Theme } from "./colorTheme";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ 
    background: Theme.background, 
    resizeTo: window,
    antialias: true, // attempt to smooth edges
  });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Create starling texture
  const starlingTexture = createStarlingTexture(app.renderer);

  for (let i = 0; i < 10; i++) {
    const starling = new Starling(starlingTexture, app.screen.width / 2, app.screen.height / 2);
    app.stage.addChild(starling.sprite);
    app.ticker.add(() => starling.update());
  }
})();
