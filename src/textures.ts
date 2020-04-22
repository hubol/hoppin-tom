import * as PIXI from "pixi.js";
    
// This file is generated. Do not touch.

export let SmallTom: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let Stars: PIXI.Texture = undefined as unknown as PIXI.Texture;


export function loadTexturesAsync()
{
    const loader = new PIXI.Loader();

    const SmallTomPath = require("./images/small tom.png");
    loader.add(SmallTomPath); 

    const StarsPath = require("./images/stars.png");
    loader.add(StarsPath); 

    
    return new Promise(resolve =>
    {
        loader.load((_, resources) => {
            SmallTom = resources[SmallTomPath]?.texture as PIXI.Texture;
            Stars = resources[StarsPath]?.texture as PIXI.Texture;

            resolve();
        });
    });
}