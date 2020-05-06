import { Sprite } from "pixi.js";
import {Sing, TomSpeak} from "../sounds";
import {Key} from "../utils/key";
import {approachLinear} from "../utils/math";
import {game} from "../tom/game";
import {subimageTextures} from "../utils/simpleSpritesheet";
import {SingingTom} from "../textures";
import {stopMusic} from "../playMusic";
import {createTextbox, Speaker} from "../gameObjects/textbox";
import {sleep} from "../utils/sleep";
import {worldMap} from "./worldMap";
import {merge} from "../utils/merge";

let tom: Tom;

export function theater()
{
    stopMusic();

    tom = makeTom();

    game.stage.addChild(tom);

    const ownedLs = game.hud.ownedLs();
    if (ownedLs === 0)
        askForSong();
    else if (ownedLs === 1)
        askForEncore();
    else
        sayNothingToDo();
}

async function askForSong()
{
    const textbox = createTextbox(game.stage);

    textbox.destroy();
}

async function askForEncore()
{
    const textbox = createTextbox(game.stage);

    textbox.destroy();
}

async function sayNothingToDo()
{
    const textbox = createTextbox(game.stage);

    await sleep(500);
    tom.canSing = true;
    textbox.speaker = tom;
    await textbox.say("I dont think anyone wants to hear my singing voice")
    await sleep(500);
    game.goto(worldMap, { escapeTicker: false })

    textbox.destroy();
}

const rates =
    [130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185, 196, 207.65, 220, 233.08, 246.94, 261.63, 277.18, 293.66, 311.13, 329.63, 349.23]
    .map(x => x / 130.81);

const singingTomTextures = subimageTextures(SingingTom, 2);

interface TomProps
{
    canSing: boolean;
}

type Tom = Sprite & TomProps & Speaker;

function makeTom(): Tom
{
    Sing.loop(true);
    Sing.volume(0);

    let offx = 0;
    let offy = 0;

    let canSing = false;

    const sprite = Sprite.from(singingTomTextures[0]).withStep(() => {
        let freq: number | null = null;

        if (canSing)
        {
            if (Key.isDown("ArrowRight"))
                freq = (freq ?? 0) + 1;
            if (Key.isDown("ArrowDown"))
                freq = (freq ?? 0) + 2;
            if (Key.isDown("ArrowLeft"))
                freq = (freq ?? 0) + 4;
            if (Key.isDown("ArrowUp"))
                freq = (freq ?? 0) + 8;
        }

        if (freq) {
            sprite.texture = singingTomTextures[1];
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

            sprite.x += offx - poffx;
            sprite.y += offy - poffy;
        } else {
            sprite.texture = singingTomTextures[0];
        }

        Sing.volume(approachLinear(Sing.volume(), !freq ? 0 : 1, 0.2));
    })
        .on("removed", () => Sing.stop())
        .on("added", () => Sing.play())
        .at(game.width / 2, game.height / 2 - 10);

    sprite.anchor.set(.5, .5);

    return merge(sprite, {
        set canSing(v: boolean) {
            canSing = v;
            console.log(canSing);
        },
        voice: TomSpeak
    });
}