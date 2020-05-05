import {playMusicAsync, stopMusic} from "../playMusic";
import {WoodedArea2} from "../musics";
import {Sprite, Texture, DisplayObject, Graphics, Container, Text} from "pixi.js";
import {ArenaBackground, Goblim as GoblimTexture, PixelArtTom} from "../textures";
import {game} from "../tom/game";
import {Key, KeyCode} from "../utils/key";
import {SansSerifFont, SerifFont} from "../fonts";
import {sleep} from "../utils/sleep";
import {wait} from "../utils/wait";
import {approachLinear} from "../utils/math";
import {GoblimBounce, GoblimDeath, GoblimHurt, GoblimSpeak, GoblimWarp} from "../sounds";
import {distance} from "../utils/vector";
import {magicLetter} from "../tom/hud";
import {worldMap} from "./worldMap";

export async function arena()
{
    await playMusicAsync(WoodedArea2);
    const tomSprite = createTom().at(32, 50);
    const goblimSprite = createGoblim(tomSprite).at(160, 64);

    const objects: DisplayObject[] = [tomSprite];
    if (!game.hud.hasI())
    {
        objects.push(goblimSprite);
    }

    const shadows = createShadows(objects);
    game.stage.addChild(Sprite.from(ArenaBackground), shadows);
    for (const object of objects)
        game.stage.addChild(object)

    if (!game.hud.hasI())
        startCutsceneAsync(tomSprite, goblimSprite);
    else
        startNothingHereCutsceneAsync(tomSprite);
}

async function startNothingHereCutsceneAsync(tom: Tom)
{
    await sleep(1000);

    const textbox = createTextbox();
    game.stage.addChild(textbox.displayObject);
    textbox.speaker = tom;
    await textbox.say("Looks like theres nothing here...");
    await sleep(250);
    game.goto(worldMap, { escapeTicker: false });
}

async function onGoblimTotallyInjured(goblim: Goblim, tom: Tom)
{
    tom.canMove = false;
    const textbox = createTextbox();
    game.stage.addChild(textbox.displayObject);

    stopMusic();
    GoblimDeath.play();

    await sleep(1000);
    textbox.speaker = goblim;
    await textbox.say("Damn! That was unexpected.");
    await textbox.say("I suppose I can't stop you from seeing the Willow...");
    await textbox.say("Take care of yourself, Hoepin tom");

    await sleep(500);
    goblim.destroy();

    textbox.displayObject.destroy();
    tom.canMove = true;

    let didit = false;
    let p = 0;

    const sprite = magicLetter(game.width / 2, game.height / 2, "i");

    sprite.withStep(() => {
            if (p > 60)
            {
                game.goto(worldMap);
            }
            else if (didit)
            {
                p++;
                tom.scale.x *= 0.9;
                tom.scale.y *= 0.9;
                tom.angle += 15;
            }
            else if (sprite.collides(tom))
            {
                game.hud.addI();
                GoblimWarp.play();
                didit = true;
                sprite.visible = false;
            }
        });

    game.stage.addChild(sprite);
}

function createGoblim(tomSprite: Tom): Goblim
{
    const goblimSprite = flippingSprite(GoblimTexture) as Sprite & Speaker & Goblimstuff;
    let i = 0;
    let injured = 0;
    let dying = false;

    let hspeed = 1;
    let vspeed = -1;

    let dist = 32;
    let f = 0;
    let hurtLast = false;

    goblimSprite.withStep(() => {
        if (dying || !goblimSprite.fighting)
            return;
        if (!dying && injured >= 100)
        {
            dying = true;
            goblimSprite.tint = 0xffffff;
            onGoblimTotallyInjured(goblimSprite, tomSprite);
            return;
        }

        const warpMode = injured > 80;

        if (!warpMode)
        {
            goblimSprite.x += hspeed;
            goblimSprite.y += vspeed;
        }
        else {
            let i = 0;
            while (distance(goblimSprite, tomSprite) < dist)
            {
                dist *= 0.5;
                if (i++ === 0)
                {
                    GoblimWarp.play();
                }
                goblimSprite.x = Math.random() * game.width;
                goblimSprite.y = Math.random() * (game.height - 32);
            }
        }

        if (goblimSprite.x < 0)
        {
            goblimSprite.x = 0;
            hspeed *= -1;
            GoblimBounce.play();
        }
        else if (goblimSprite.x > game.width)
        {
            goblimSprite.x = game.width;
            hspeed *= -1;
            GoblimBounce.play();
        }

        if (goblimSprite.y < 0)
        {
            goblimSprite.y = 0;
            vspeed *= -1;
            GoblimBounce.play();
        }
        else if (goblimSprite.y > game.height - 32)
        {
            goblimSprite.y = game.height - 32;
            vspeed *= -1;
            GoblimBounce.play();
        }

        const hurt = tomSprite.collides(goblimSprite);
        if (hurt)
        {
            injured += 0.5;
            if (warpMode && f++ > 5)
            {
                f = 0;
                dist += 32;
            }
            hspeed *= 1.01;
            vspeed *= 1.01;
            hspeed += -.005 + Math.random() * .01;
            vspeed += -.005 + Math.random() * .01;
            goblimSprite.tint = 0xff0000;
            if (i++ % 4 === 0 || !hurtLast)
                GoblimHurt.play();
        }
        else
            goblimSprite.tint = 0xffffff;

        hurtLast = hurt;
    });

    goblimSprite.voice = GoblimSpeak;
    return goblimSprite;
}

function createTom(): Tom
{
    let hspeed = 0;
    let vspeed = 0;
    const sprite = flippingSprite(PixelArtTom) as Sprite & Tomstuff;

    sprite.withStep(() => {
        if (sprite.canMove)
        {
            if (Key.isDown("ArrowRight"))
                hspeed = approachLinear(hspeed, 1.5, 1);
            else if (Key.isDown("ArrowLeft"))
                hspeed = approachLinear(hspeed, -1.5, 1);
            else
                hspeed = approachLinear(hspeed, 0, 0.5);

            if (Key.isDown("ArrowDown"))
                vspeed = approachLinear(vspeed, 1.5, 1);
            else if (Key.isDown("ArrowUp"))
                vspeed = approachLinear(vspeed, -1.5, 1);
            else
                vspeed = approachLinear(vspeed, 0, 0.5);

            sprite.x += hspeed;
            sprite.y += vspeed;
        }

        sprite.x = Math.min(game.width, Math.max(0, sprite.x));
        sprite.y = Math.min(game.height - 30, Math.max(12, sprite.y));
    });

    return sprite;
}

async function startCutsceneAsync(tom: Tom, goblim: Goblim)
{
    const textbox = createTextbox();
    game.stage.addChild(textbox.displayObject);

    tom.canMove = true;

    await sleep(2000);
    tom.canMove = false;
    await stepForward(goblim, -9);

    await sleep(250);
    textbox.speaker = goblim;
    await textbox.say("Heh, bet you werent expecting to see any goblims out here.");

    await stepForward(goblim, -3);
    await sleep(250);
    await textbox.say("Look, I know what you want. But I can't let you see the willow.");
    await textbox.say("En garde!!!!");

    textbox.displayObject.destroy();
    tom.canMove = true;
    goblim.fighting = true;
}

function stepForward(o: DisplayObject, speed: number)
{
    let hspeed = speed;

    return new Promise<void>(resolve => {
        const displayObject = new DisplayObject();
        displayObject.withStep(() => {
            o.x += hspeed;
            hspeed *= 0.8;
            if (Math.abs(hspeed) < 0.3)
            {
                displayObject.destroy();
                resolve();
            }
        });
        game.stage.addChild(displayObject);
    })
}

interface Tomstuff
{
    canMove: boolean;
}

interface Goblimstuff
{
    fighting: boolean;
}

type Tom = DisplayObject & Tomstuff;
type Goblim = DisplayObject & Speaker & Goblimstuff;

interface Speaker
{
    voice: Howl;
}

interface Textbox
{
    speaker: DisplayObject | Speaker;
    say(message: string): Promise<void>;
    displayObject: DisplayObject;
}

function createTextbox(): Textbox
{
    function getTailStartX(x : number)
    {
        if (x > game.width * .67)
            return game.width * .8;
        if (x < game.width * .33)
            return game.width * .2;
        return game.width * .5;
    }

    let speaker: DisplayObject & Speaker;

    const graphics = new Graphics();
    const text = new Text("", {
        fontFamily: SansSerifFont,
        fontSize: 10,
        fontWeight: "bold",
        align: "center",
        trim: true,
        wordWrap: true,
        wordWrapWidth: game.width - 12,
        lineHeight: 9.5,
        letterSpacing: 0.33
    });
    text.anchor.set(0.5, 0.5);

    graphics.withStep(() => {
       graphics.clear();
       graphics.beginFill(0xffffff);

       const margin = 4;
       const height = 32;
       const centery = margin + height / 2;
       const bottomy = margin + height;
       text.position.set(game.width / 2, centery);
       graphics.drawRoundedRect(margin, margin, game.width - margin * 2, height, 12);

       if (speaker)
       {
           const rectangle = speaker.rectangle;
           const x = rectangle.x + rectangle.width / 2;
           const startx = getTailStartX(x);
           graphics.lineStyle(1, 0xffffff);
            graphics.moveTo(startx - 2, bottomy);
           graphics.lineTo(startx + 2, bottomy);
           graphics.lineTo(x, rectangle.y - 1);
           graphics.closePath();
       }
    });

    const container = new Container();
    container.visible = false;
    container.addChild(graphics, text);

    return {
        async say(nextMessage: string): Promise<void> {
            container.visible = true;
            text.text = nextMessage;
            if (speaker && "voice" in speaker)
                speaker.voice.play();
            await waitForKey("Space");
            container.visible = false;
        },
        get displayObject() {
            return container;
        },
        set speaker(displayObject) {
            speaker = displayObject;
        }
    }
}

async function waitForKey(keyCode: KeyCode)
{
    let wasUp = false;
    let advance = false;

    const displayObject = new DisplayObject();
    displayObject.withStep(() => {
        if (wasUp && Key.justWentDown(keyCode))
            advance = true;
        if (Key.isUp(keyCode))
            wasUp = true;
    });
    game.stage.addChild(displayObject);

    await wait(() => advance);
    displayObject.destroy();
}

interface Shadows
{
    displayObjects: DisplayObject[];
}

function createShadows(displayObjects: DisplayObject[])
{
    const graphics = new Graphics() as Graphics & Shadows;
    graphics.withStep(() => {
        graphics.clear();
        graphics.beginFill(0xbb5522);
        for (const displayObject of displayObjects)
        {
            if (displayObject.destroyed)
                continue;

            const rectangle = displayObject.rectangle;
            graphics.drawEllipse(rectangle.x + rectangle.width / 2, rectangle.y + rectangle.height, rectangle.width / 2, 3);
        }
        graphics.endFill();
    });
    graphics.displayObjects = displayObjects;

    return graphics;
}

function flippingSprite(texture: Texture)
{
    const sprite = new Sprite(texture);
    sprite.anchor.x = 0.5;
    let count = 0;
    return sprite.withStep(() => {
        if (count++ < 15)
            return;

        sprite.scale.x = -sprite.scale.x;
        count = 0;
    });
}