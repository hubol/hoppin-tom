import * as PIXI from "pixi.js";
    
// This file is generated. Do not touch.

export let MapBackground: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let MapTom: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let MapWoodedArea: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let SmallTom: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let Stars: PIXI.Texture = undefined as unknown as PIXI.Texture;


export function loadTexturesAsync()
{
    const loader = new PIXI.Loader();

    const MapBackgroundPath = require("./images/map background.png");
    loader.add(MapBackgroundPath); 

    const MapTomPath = require("./images/map tom.png");
    loader.add(MapTomPath); 

    const MapWoodedAreaPath = require("./images/map wooded area.png");
    loader.add(MapWoodedAreaPath); 

    const SmallTomPath = require("./images/small tom.png");
    loader.add(SmallTomPath); 

    const StarsPath = require("./images/stars.png");
    loader.add(StarsPath); 

    
    return new Promise(resolve =>
    {
        loader.load((_, resources) => {
            MapBackground = resources[MapBackgroundPath]?.texture as PIXI.Texture;
            MapTom = resources[MapTomPath]?.texture as PIXI.Texture;
            MapWoodedArea = resources[MapWoodedAreaPath]?.texture as PIXI.Texture;
            SmallTom = resources[SmallTomPath]?.texture as PIXI.Texture;
            Stars = resources[StarsPath]?.texture as PIXI.Texture;

            resolve();
        });
    });
}