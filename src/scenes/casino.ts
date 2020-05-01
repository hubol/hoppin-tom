import {playMusicAsync} from "../playMusic";
import {WoodedArea1} from "../musics";
import {game} from "../tom/game";
import {CasinoBackground, CasinoExitSign, RandomSymbols, SmallTom, SpinButton} from "../textures";
import { Sprite, Container, Graphics, Text, AnimatedSprite } from "pixi.js";
import {Key} from "../utils/key";
import {DropShadowFilter} from "@pixi/filter-drop-shadow";
import {GlowFilter} from "@pixi/filter-glow";
import {worldMap} from "./worldMap";
import {SerifFont} from "../fonts";
import {subimageTextures} from "../utils/simpleSpritesheet";
import {SpinPress, SpinRelease} from "../sounds";

const randomSymbols = subimageTextures(RandomSymbols, 4);
const glowColors = [ 0xffffff, 0xff0000, 0xffff00, 0x00ffff, 0xff00ff ];

export async function casino()
{
    await playMusicAsync(WoodedArea1);
    const background = Sprite.from(CasinoBackground);
    background.width = game.width;
    background.height = game.height;

    const spinButton = Sprite.from(SpinButton);
    spinButton.position.set(game.width - 12, 64);
    spinButton.anchor.set(0.5, 0.5);

    const textBubble = makeTextBubble();
    textBubble.position.set(game.width/2, game.height - 32);

    const slots = new Sprite(randomSymbols[0]);
    slots.anchor.x = 1;
    slots.x = game.width;
    slots.scale.set(2, 2);
    const glowFilter = new GlowFilter({  });
    let x = 0;
    slots.withStep(() => {
        x += 0.2;
        slots.texture = randomSymbols[Math.floor(x % randomSymbols.length)];
        glowFilter.color = glowColors[Math.floor(x % glowColors.length)]
    });
    slots.visible = false;
    slots.filters = [ glowFilter ];

    let canMove = true;

    const smallTom = Sprite.from(SmallTom);
    smallTom.anchor.set(0.5, 0.5);
    smallTom.position.set(32, 12);
    smallTom.withStep(() => {
        if (!canMove)
            return;

        const xprev = smallTom.x;
        const yprev = smallTom.y;

        if (Key.isDown("ArrowRight"))
            smallTom.x += 1;
        else if (Key.isDown("ArrowLeft"))
            smallTom.x -= 1;
        else if (Key.isDown("ArrowUp"))
            smallTom.y -= 1;
        else if (Key.isDown("ArrowDown"))
            smallTom.y += 1;

        smallTom.x = Math.min(game.width, Math.max(0, smallTom.x));
        smallTom.y = Math.min(game.height, Math.max(0, smallTom.y));
        smallTom.angle += smallTom.x - xprev + smallTom.y - yprev;
    });

    let collidesPrev = false;

    spinButton.withStep(() => {
        const collides = spinButton.collides(smallTom);
        spinButton.tint = collides ? 0x999999 : 0xffffff;

        if (collidesPrev !== collides)
            (collides ? SpinPress : SpinRelease).play();

        if (!collidesPrev && collides)
        {
            if (slots.visible)
            {
                const win = Math.random() > 0.9;
                textBubble.show(win ? "You win." : "You lose.");
                if (win)
                {
                    canMove = false;
                    setTimeout(() => canMove = true, 1000);
                }
            }
            else
                textBubble.visible = false;

            slots.visible = !slots.visible;
        }
        collidesPrev = collides;
    });

    const casinoExitSign = Sprite.from(CasinoExitSign);
    casinoExitSign.position.set(4, 4);
    casinoExitSign.withStep(() => {
        if (smallTom.collides(casinoExitSign))
            game.goto(worldMap);
    });

    const dropShadowFilter = new DropShadowFilter({distance: 3, alpha: 0.5, quality: 3, blur: 1});
    smallTom.filters = [dropShadowFilter];

    game.stage.addChild(background, spinButton, casinoExitSign, textBubble, slots, smallTom);
}

interface Showable
{
    show(message: string);
}

function makeTextBubble(): Container & Showable
{
    const container = new Container() as Container & Showable;
    const graphics = new Graphics();
    graphics.beginFill(0xffff00);
    graphics.drawEllipse(0, 0, game.width / 2, 10);
    graphics.endFill();

    const text = new Text("", {
        fontFamily: SerifFont,
        fontSize: 16,
        fill: 0x002244
    });

    text.anchor.set(0.5, 0.5);

    container.addChild(graphics, text);
    container.visible = false;

    let life = 0;

    container.show = (message: string) => {
        text.text = message;
        container.visible = true;
        life = 60;
    };

    container.withStep(() => {
        if (life-- <= 0)
            container.visible = false;
    });

    return container;
}