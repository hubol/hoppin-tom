import { Sprite, DisplayObject } from "pixi.js";
import {Elf1Speak, Elf2Speak, Sing, TomSpeak} from "../sounds";
import {Key} from "../utils/key";
import {approachLinear} from "../utils/math";
import {game} from "../tom/game";
import {subimageTextures} from "../utils/simpleSpritesheet";
import {AudienceElf, AudienceElf2, SingingTom, TheaterBackground} from "../textures";
import {stopMusic} from "../playMusic";
import {createTextbox, Speaker} from "../gameObjects/textbox";
import {sleep} from "../utils/sleep";
import {worldMap} from "./worldMap";
import {merge} from "../utils/merge";
import {getCurrentTimeMilliseconds} from "../utils/time";
import {Vector} from "../utils/vector";
import {wait} from "../utils/wait";
import {GlowFilter} from "@pixi/filter-glow";
import {magicLetter} from "../tom/hud";
import {EscapeTickerAndExecute} from "../utils/iguaTicker";

let tom: Tom;

export function theater()
{
    stopMusic();

    tom = makeTom();

    game.stage.addChild(Sprite.from(TheaterBackground), tom);

    const ownedLs = game.hud.ownedLs();
    if (ownedLs === 0)
        askForSong();
    else if (ownedLs === 1)
        askForEncore(); // unreachable (hopefully)
    else
        sayNothingToDo();
}

async function askForSong()
{
    const textbox = createTextbox(game.stage);

    await sleep(500);
    const elf = createElf(0).at(32, game.height - 20);
    await waitUntilStopped(elf);
    textbox.speaker = elf;

    await textbox.say("Hoppin Tom, I need to hear your beautiful voice");
    tom.canSing = true;
    song.reset();

    await wait(() => song.isBeautiful);
    await textbox.say("Your amazing");

    await sleep(500);

    if (await awardL())
        return; // unreachable (hopefully)

    textbox.destroy();

    await askForEncore();
}

async function awardL()
{
    const letter = magicLetter(game.width, game.height / 2 - 20, "l")
        .withStep(() => letter.x -= 2);

    game.stage.addChild(letter);

    await wait(() => Math.abs(letter.x - tom.x) < 8 || letter.x < game.width * .25);

    try
    {
        game.hud.addL();
    }
    catch (e)
    {
        if (e instanceof EscapeTickerAndExecute)
        {
            game.stage.addChild(new DisplayObject().withStep(() => { throw e; }));
            return true;
        }

        throw e;
    }

    letter.destroy();
    return false;
}

async function waitUntilStopped(vector: Vector)
{
    const previousPosition = { ...vector };
    await wait(() => {
       if (vector.x === previousPosition.x && vector.y === previousPosition.y)
           return true;

       previousPosition.x = vector.x;
       previousPosition.y = vector.y;
       return false;
    });
}

async function askForEncore()
{
    tom.canSing = false;

    const textbox = createTextbox(game.stage);

    await sleep(500);
    const elf = createElf(1).at(64, game.height - 20);
    await waitUntilStopped(elf);
    textbox.speaker = elf;

    await textbox.say("OMG, I heard your singing!!!");
    await textbox.say("Hoppin Tom, mama needs an encore!!!");

    tom.canSing = true;
    tom.encore = true;
    song.reset();

    await wait(() => song.isBeautiful);
    await textbox.say("Tom... What can I say...");
    await textbox.say("That ***** ***** rocked !!!!");

    await sleep(500);

    if (await awardL())
        return;

    await sleep(500);

    textbox.speaker = tom;
    await textbox.say("Im leaving now");

    await sleep(250);
    game.goto(worldMap, { escapeTicker: false });
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

let numberOfNotes: number | null = null;
let firstNoteTimeMilliseconds: number | null = null;

const song = {
    reset()
    {
        numberOfNotes = null;
        firstNoteTimeMilliseconds = null;
    },

    onNotePlayed()
    {
        if (numberOfNotes === null)
        {
            numberOfNotes = 0;
            firstNoteTimeMilliseconds = getCurrentTimeMilliseconds();
        }

        numberOfNotes++;
    },

    get timeSinceFirstNoteMilliseconds()
    {
        if (!firstNoteTimeMilliseconds)
            return null;
        return getCurrentTimeMilliseconds() - firstNoteTimeMilliseconds;
    },

    get beautyFactor()
    {
        if (!this.timeSinceFirstNoteMilliseconds || !numberOfNotes)
            return 0;

        return (Math.min(this.timeSinceFirstNoteMilliseconds / 10000, 1)
            + Math.min(numberOfNotes / 32, 1)) / 2;
    },

    get isBeautiful()
    {
        return this.beautyFactor >= 1;
    }
};

interface TomProps
{
    canSing: boolean;
    glowFilter: GlowFilter;
    encore: boolean;
}

type Tom = Sprite & TomProps & Speaker;

function makeTom(): Tom
{
    Sing.loop(true);
    Sing.volume(0);

    let offx = 0;
    let offy = 0;

    let canSing = false;
    let prevFreq;
    let encore = false;

    const glowFilter = new GlowFilter({ distance: 16 });

    let i = 0;
    const sprite = Sprite.from(singingTomTextures[0]).withStep(() => {
        i += 0.2;
        glowFilter.innerStrength = song.beautyFactor * (Math.abs(Math.cos(i) * .6) + .4);
        glowFilter.outerStrength = song.beautyFactor * (Math.abs(Math.cos(i) * .6) + .4);
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
            if (freq !== prevFreq)
                song.onNotePlayed();

            sprite.texture = singingTomTextures[1];
            let rate = rates[Math.min(freq as number - 1, rates.length - 1)];
            if (encore)
                rate += 1;
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

        prevFreq = freq;

        Sing.volume(approachLinear(Sing.volume(), !freq ? 0 : 1, 0.2));
    })
        .on("removed", () => Sing.stop())
        .on("added", () => Sing.play())
        .at(game.width / 2, game.height / 2 - 10);

    sprite.filters = [glowFilter];
    sprite.anchor.set(.5, .5);

    return merge(sprite, {
        set canSing(v: boolean) {
            canSing = v;
        },
        voice: TomSpeak,
        glowFilter,
        set encore(v) {
            encore = v;
        }
    });
}

function createElf(style: 0 | 1)
{
    const sprite = new Sprite(style === 0 ? AudienceElf : AudienceElf2);
    let i = 0;
    const sprite1 = sprite
        .withStep(() => {
            if (i++ < 16)
                sprite.y -= 1;
        });
    game.stage.addChild(sprite1);

    (sprite1 as any).voice = style === 0 ? Elf1Speak : Elf2Speak;

    return sprite1;
}