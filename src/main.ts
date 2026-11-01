import { Application } from "pixi.js";
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

  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;

  // Create starling texture
  const starlingTexture = createStarlingTexture(app.renderer);

  app.stage.on('pointertap', (event) => {
      const starling = new Starling(starlingTexture, event.x, event.y);
      app.stage.addChild(starling.sprite);
      app.ticker.add(() => starling.update());
    });
})();
