import { Container, Graphics, Sprite } from "pixi.js";
import {game} from "./game";
import {subimageTextures} from "../utils/simpleSpritesheet";
import {MagicLetters} from "../textures";
import {DropShadowFilter} from "@pixi/filter-drop-shadow";
import {congrats} from "../scenes/congrats";

export interface Hud
{
    addW();
    addI();
    addL();
    addO();
    hasI(): boolean;
    hasO(): boolean;
    ownedLs(): 0 | 1 | 2;
}

const magicLetters = subimageTextures(MagicLetters, 4);

type Letter = "w" | "i" | "l" | "o";

function getMagicLetterTexture(letter: Letter)
{
    switch (letter) {
        case "w":
            return magicLetters[0];
        case "i":
            return magicLetters[1];
        case "l":
            return magicLetters[2];
        case "o":
            return magicLetters[3];
    }
}

export function magicLetter(x, y, letter: Letter)
{
    const sprite = new Sprite(getMagicLetterTexture(letter));
    sprite.position.set(x, y);
    return sprite;
}

export function hud()
{
    const w1 = magicLetter(4, -1, "w");
    w1.visible = false;
    const i = magicLetter(24, -1, "i");
    i.visible = false;
    const l1 = magicLetter(44, -1, "l");
    l1.visible = false;
    const l2 = magicLetter(64, -1, "l");
    l2.visible = false;
    const o = magicLetter(84, -1, "o");
    o.visible = false;
    const w2 = magicLetter(104, -1, "w");
    w2.visible = false;

    function onLetterEarned()
    {
        // TODO sfx
        if (w1.visible && i.visible && l1.visible && l2.visible && o.visible && w2.visible)
            game.goto(congrats);
    }

    const container = new Container() as Container & Hud;

    container.hasI = () => i.visible;
    container.hasO = () => o.visible;

    container.addW = () => {
        if (w1.visible)
            w2.visible = true;
        else
            w1.visible = true;
        onLetterEarned();
    };
    container.addI = () => {
        i.visible = true;
        onLetterEarned();
    }
    container.addL = () => {
        if (l1.visible)
            l2.visible = true;
        else
            l1.visible = true;
        onLetterEarned();
    }
    container.addO = () => {
        o.visible = true;
        onLetterEarned();
    }
    container.ownedLs = () => ((l1.visible ? 1 : 0) + (l2.visible ? 1 : 0)) as 0 | 1 | 2;

    const graphics = new Graphics();
    graphics.beginFill(0x222244);
    graphics.drawEllipse(64, 20, 160, 24);
    graphics.endFill();

    container.addChild(graphics, w1, i, l1, l2, o, w2);
    const dropShadowFilter = new DropShadowFilter({distance: 1, alpha: 0.5, quality: 3, blur: 1, rotation: -90});
    container.filters = [dropShadowFilter];

    return container;
}