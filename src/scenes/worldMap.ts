import {game} from "../tom/game";
import { Sprite, Container } from "pixi.js";
import {MapBackground, MapTom} from "../textures";

export function worldMap()
{
    game.stage.addChild(Sprite.from(MapBackground));
}