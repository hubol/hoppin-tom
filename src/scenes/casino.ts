import {playMusicAsync} from "../playMusic";
import {WoodedArea1} from "../musics";
import {game} from "../tom/game";
import {CasinoBackground, SmallTom, SpinButton} from "../textures";
import { Sprite } from "pixi.js";
import {Key} from "../utils/key";
import {DropShadowFilter} from "@pixi/filter-drop-shadow";

export async function casino()
{
    await playMusicAsync(WoodedArea1);
    const background = Sprite.from(CasinoBackground);
    background.width = game.width;
    background.height = game.height;

    const spinButton = Sprite.from(SpinButton);
    spinButton.position.set(game.width - 12, 12);
    spinButton.anchor.set(0.5, 0.5);

    const smallTom = Sprite.from(SmallTom);
    smallTom.anchor.set(0.5, 0.5);
    smallTom.position.set(12, 12);
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

        smallTom.angle += smallTom.x - xprev + smallTom.y - yprev;
    });

    spinButton.withStep(() => {
        spinButton.tint = spinButton.collides(smallTom) ? 0x999999 : 0xffffff;
    });

    const dropShadowFilter = new DropShadowFilter({distance: 3, alpha: 0.5, quality: 3, blur: 1});
    smallTom.filters = [dropShadowFilter];

    game.stage.addChild(background, spinButton, smallTom);
}