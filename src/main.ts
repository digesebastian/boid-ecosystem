import { Application, Graphics } from "pixi.js";
import { Starling } from "./starling";
import { Insect } from "./Insect"
import { createStarlingTexture, createInsectTexture } from "./textureFactory";
import { Theme } from "./colorTheme";
import { Settings } from "./settings";

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
  const starlings: Starling[] = [];

  const insectTexture = createInsectTexture(app.renderer);

  const debugGraphics = new Graphics();
  app.stage.addChild(debugGraphics);

  let debugMode = false; // Set to true to enable debug mode
  window.addEventListener('keydown', (event) => {
    if (event.key === 'd') {
      debugMode = !debugMode;
      app.canvas.style.border = debugMode ? '3px solid red' : '3px solid transparent'; // Add or remove border based on debug mode
    }
  });

  app.stage.on('pointertap', (event) => {
      const starling = new Starling(starlingTexture, event.x, event.y, app.screen.width, app.screen.height, debugGraphics);
      console.log(`Created starling at (${event.x}, ${event.y}) with velocity (${starling.velocity.x.toFixed(2)}, ${starling.velocity.y.toFixed(2)})`);
      starlings.push(starling);
      app.stage.addChild(starling.sprite);
    });

  
  let insectTicker = 0;
  app.ticker.add(() => {
    debugGraphics.clear();
    for (const starling of starlings) {
      starling.steer(starlings);
      if (debugMode) {
        starling.drawDebug();
      }
    }

    insectTicker++;
    if (insectTicker >= Settings.INSECT_TICK_RATE) {
      insectTicker = 0;
      const insect = new Insect(insectTexture, Math.random() * app.screen.width, Math.random() * app.screen.height);
      app.stage.addChild(insect.sprite);
      console.log(`Created insect at (${insect.position.x.toFixed(2)}, ${insect.position.y.toFixed(2)})`);
    }

    });
})();
