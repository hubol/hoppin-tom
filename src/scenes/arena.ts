import {playMusicAsync} from "../playMusic";
import {WoodedArea2} from "../musics";
import {Sprite, Texture, DisplayObject, Graphics, Container, Text} from "pixi.js";
import {Goblim as GoblimTexture, PixelArtTom} from "../textures";
import {game} from "../tom/game";
import {Key, KeyCode} from "../utils/key";
import {SansSerifFont, SerifFont} from "../fonts";
import {sleep} from "../utils/sleep";
import {wait} from "../utils/wait";

export async function arena()
{
    await playMusicAsync(WoodedArea2);
    const tomSprite = flippingSprite(PixelArtTom).at(32, 50);
    const goblimSprite = flippingSprite(GoblimTexture).at(96, 64);

    const objects = [tomSprite];
    if (!game.hud.hasI())
    {
        objects.push(goblimSprite);
    }

    const shadows = createShadows(objects);
    game.stage.addChild(shadows);
    for (const object of objects)
        game.stage.addChild(object)

    if (!game.hud.hasI())
        startCutsceneAsync(tomSprite, goblimSprite);
}

async function startCutsceneAsync(tom: Tom, goblim: Goblim)
{
    const textbox = createTextbox();
    game.stage.addChild(textbox.displayObject);

    await sleep(250);
    textbox.speaker = goblim;
    await textbox.say("Heh, bet you werent expecting to see any goblims out here.");

    await sleep(250);
    await textbox.say("Look, I know what you want. But I can't let you see the willow.");
    await textbox.say("En garde!!!!");
}

type Tom = DisplayObject;
type Goblim = DisplayObject;

interface Textbox
{
    speaker: DisplayObject;
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

    let speaker: DisplayObject;

    const graphics = new Graphics();
    const text = new Text("", {
        fontFamily: SansSerifFont,
        fontSize: 10,
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

function waitForKey(keyCode: KeyCode)
{
    let down = false;
    let up = false;

    const displayObject = new DisplayObject();
    displayObject.withStep(() => {
        if (Key.justWentDown(keyCode))
            down = true;
        if (down && Key.justWentUp(keyCode))
            up = true;
    });
    game.stage.addChild(displayObject);

    return wait(() => up);
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