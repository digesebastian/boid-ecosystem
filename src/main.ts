import { Application, Assets, Sprite, Graphics } from "pixi.js";
import { Starling } from "./starling";

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Load the bunny texture
  const starlingGraphics = new Graphics().regularPoly(0, 0, 20, 3).fill(0xFF0000);
  const starlingTexture = app.renderer.generateTexture(starlingGraphics);

  for (let i = 0; i < 10; i++) {
    const starling = new Starling(starlingTexture, app.screen.width / 2, app.screen.height / 2);
    app.stage.addChild(starling.sprite);
    app.ticker.add(() => starling.update());
  }
})();
