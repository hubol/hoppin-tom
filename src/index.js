import {loadTexturesAsync} from "./textures";
import {loadFontsAsync} from "./fonts";
import {loadHowlsAsync} from "./utils/loadHowls";
import * as exportedSounds from "./sounds";
import * as PIXI from "pixi.js";

async function initialize()
{
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    const howls = Object.values(exportedSounds);
    await Promise.all([loadFontsAsync(), loadTexturesAsync(), loadHowlsAsync(howls)]);
    require("./utils/arrayExtensions");
    require("./utils/pixiExtensions");
    require("./tom/game").startGame();
}

const beginButtonElement = document.getElementById("begin");
beginButtonElement.onclick = async () => {
    beginButtonElement.remove();
    await initialize();
};