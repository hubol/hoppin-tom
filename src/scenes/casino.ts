import {playMusicAsync} from "../playMusic";
import {WoodedArea1} from "../musics";
import {game} from "../tom/game";
import {CasinoBackground} from "../textures";
import { Sprite } from "pixi.js";

export async function casino()
{
    await playMusicAsync(WoodedArea1);
    const background = Sprite.from(CasinoBackground);
    background.width = game.width;
    background.height = game.height;
    game.stage.addChild(background);
}