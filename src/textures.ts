import * as PIXI from "pixi.js";
    
// This file is generated. Do not touch.

export let SmallTom: PIXI.Texture = undefined as unknown as PIXI.Texture;


export function loadTexturesAsync()
{
    const loader = new PIXI.Loader();

    const SmallTomPath = require("./images/small tom.png");
    loader.add(SmallTomPath); 

    
    return new Promise(resolve =>
    {
        loader.load((_, resources) => {
            SmallTom = resources[SmallTomPath]?.texture as PIXI.Texture;

            resolve();
        });
    });
}