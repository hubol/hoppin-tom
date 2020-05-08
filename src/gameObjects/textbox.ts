import {Container, DisplayObject, Graphics, Text} from "pixi.js";
import {game} from "../tom/game";
import {SansSerifFont} from "../fonts";
import {Key, KeyCode} from "../utils/key";
import {wait} from "../utils/wait";
import {CloseTextbox} from "../sounds";

export interface Speaker {
    voice: Howl;
}

interface Textbox
{
    speaker: DisplayObject | Speaker;
    say(message: string): Promise<void>;
    displayObject: DisplayObject;
    destroy();
}

export function createTextbox(stage?: Container): Textbox
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

    if (stage)
        stage.addChild(container);

    return {
        async say(nextMessage: string): Promise<void> {
            container.visible = true;
            text.text = nextMessage;
            if (speaker && "voice" in speaker)
                speaker.voice.play();
            await waitForKey("Space");
            CloseTextbox.play();
            container.visible = false;
        },
        get displayObject() {
            return container;
        },
        set speaker(displayObject) {
            speaker = displayObject;
        },
        destroy() {
            container.destroy();
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