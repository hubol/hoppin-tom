import { Sprite } from "pixi.js";
import {Sing} from "../sounds";
import {Key} from "../utils/key";
import {approachLinear} from "../utils/math";
import {game} from "../tom/game";
import {subimageTextures} from "../utils/simpleSpritesheet";
import {SingingTom} from "../textures";
import {stopMusic} from "../playMusic";

const rates =
    [130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185, 196, 207.65, 220, 233.08, 246.94, 261.63, 277.18, 293.66, 311.13, 329.63, 349.23]
    .map(x => x / 130.81);

const singingTomTextures = subimageTextures(SingingTom, 2);

export function theater()
{
    stopMusic();
    Sing.loop(true);
    Sing.volume(0);

    let offx = 0;
    let offy = 0;
    const displayObject = Sprite.from(singingTomTextures[0]).withStep(() => {
        let freq: number | null = null;
        if (Key.isDown("ArrowRight"))
            freq = (freq ?? 0) + 1;
        if (Key.isDown("ArrowDown"))
            freq = (freq ?? 0) + 2;
        if (Key.isDown("ArrowLeft"))
            freq = (freq ?? 0) + 4;
        if (Key.isDown("ArrowUp"))
            freq = (freq ?? 0) + 8;

        if (freq)
        {
            displayObject.texture = singingTomTextures[1];
            const rate = rates[Math.min(freq as number - 1, rates.length - 1)];
            if (Sing.volume() === 0)
                Sing.rate(rate);
            else
                Sing.rate(approachLinear(Sing.rate(), rate, 0.1));
            const poffx = offx;
            const poffy = offy;

            offx += -rate / 2 + Math.random() * rate;
            offy += -rate / 2 + Math.random() * rate;
            if (Math.abs(offx) > 8)
                offx *= .9;
            if (Math.abs(offy) > 8)
                offy *= .9;

            displayObject.x += offx - poffx;
            displayObject.y += offy - poffy;
        }
        else
        {
            displayObject.texture = singingTomTextures[0];
        }

        Sing.volume(approachLinear(Sing.volume(), !freq ? 0 : 1, 0.2));
    })
        .on("removed", () => Sing.stop())
        .on("added", () => Sing.play())
        .at(game.width / 2, game.height / 2 - 10);

    displayObject.anchor.set(.5, .5);

    game.stage.addChild(displayObject);
}