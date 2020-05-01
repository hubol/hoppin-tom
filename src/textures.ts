import * as PIXI from "pixi.js";
    
// This file is generated. Do not touch.

export let CasinoBackground: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let CasinoExitSign: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let MagicLetters: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let MapBackground: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let MapTom: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let MapWoodedArea: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let RandomSymbols: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let SmallTom: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let SpinButton: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let Stars: PIXI.Texture = undefined as unknown as PIXI.Texture;


export function loadTexturesAsync()
{
    const loader = new PIXI.Loader();

    const CasinoBackgroundPath = require("./images/casino background.png");
    loader.add(CasinoBackgroundPath); 

    const CasinoExitSignPath = require("./images/casino exit sign.png");
    loader.add(CasinoExitSignPath); 

    const MagicLettersPath = require("./images/magic letters.png");
    loader.add(MagicLettersPath); 

    const MapBackgroundPath = require("./images/map background.png");
    loader.add(MapBackgroundPath); 

    const MapTomPath = require("./images/map tom.png");
    loader.add(MapTomPath); 

    const MapWoodedAreaPath = require("./images/map wooded area.png");
    loader.add(MapWoodedAreaPath); 

    const RandomSymbolsPath = require("./images/random symbols.png");
    loader.add(RandomSymbolsPath); 

    const SmallTomPath = require("./images/small tom.png");
    loader.add(SmallTomPath); 

    const SpinButtonPath = require("./images/spin button.png");
    loader.add(SpinButtonPath); 

    const StarsPath = require("./images/stars.png");
    loader.add(StarsPath); 

    
    return new Promise(resolve =>
    {
        loader.load((_, resources) => {
            CasinoBackground = resources[CasinoBackgroundPath]?.texture as PIXI.Texture;
            CasinoExitSign = resources[CasinoExitSignPath]?.texture as PIXI.Texture;
            MagicLetters = resources[MagicLettersPath]?.texture as PIXI.Texture;
            MapBackground = resources[MapBackgroundPath]?.texture as PIXI.Texture;
            MapTom = resources[MapTomPath]?.texture as PIXI.Texture;
            MapWoodedArea = resources[MapWoodedAreaPath]?.texture as PIXI.Texture;
            RandomSymbols = resources[RandomSymbolsPath]?.texture as PIXI.Texture;
            SmallTom = resources[SmallTomPath]?.texture as PIXI.Texture;
            SpinButton = resources[SpinButtonPath]?.texture as PIXI.Texture;
            Stars = resources[StarsPath]?.texture as PIXI.Texture;

            resolve();
        });
    });
}