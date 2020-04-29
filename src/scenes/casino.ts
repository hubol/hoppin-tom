import {playMusicAsync} from "../playMusic";
import {WoodedArea1} from "../musics";
import {game} from "../tom/game";
import {CasinoBackground, CasinoExitSign, SmallTom, SpinButton} from "../textures";
import { Sprite } from "pixi.js";
import {Key} from "../utils/key";
import {DropShadowFilter} from "@pixi/filter-drop-shadow";
import {worldMap} from "./worldMap";

export async function casino()
{
    await playMusicAsync(WoodedArea1);
    const background = Sprite.from(CasinoBackground);
    background.width = game.width;
    background.height = game.height;

    const spinButton = Sprite.from(SpinButton);
    spinButton.position.set(game.width - 12, 64);
    spinButton.anchor.set(0.5, 0.5);

    const smallTom = Sprite.from(SmallTom);
    smallTom.anchor.set(0.5, 0.5);
    smallTom.position.set(32, 12);
    smallTom.withStep(() => {
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

    spinButton.withStep(() => {
        spinButton.tint = spinButton.collides(smallTom) ? 0x999999 : 0xffffff;
    });

    const casinoExitSign = Sprite.from(CasinoExitSign);
    casinoExitSign.position.set(4, 4);
    casinoExitSign.withStep(() => {
        if (smallTom.collides(casinoExitSign))
            game.goto(worldMap);
    });

    const dropShadowFilter = new DropShadowFilter({distance: 3, alpha: 0.5, quality: 3, blur: 1});
    smallTom.filters = [dropShadowFilter];

    game.stage.addChild(background, spinButton, casinoExitSign, smallTom);
}