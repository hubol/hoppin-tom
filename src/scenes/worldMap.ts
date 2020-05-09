import {game, Scene} from "../tom/game";
import { Sprite, Container, DisplayObject } from "pixi.js";
import {MapBackground, MapTom, MapWoodedArea} from "../textures";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import {Key} from "../utils/key";
import {approachLinear} from "../utils/math";
import {playMusicAsync} from "../playMusic";
import {Overworld} from "../musics";
import {casino} from "./casino";
import {arena} from "./arena";
import {theater} from "./theater";
import {pile} from "./pile";
import {add, distance, vector} from "../utils/vector";

export async function worldMap()
{
    await playMusicAsync(Overworld);
    game.stage.addChild(Sprite.from(MapBackground));
    const container = new Container();
    const dropShadowFilter = new DropShadowFilter({distance: 3, alpha: 0.5, quality: 3, blur: 1});
    container.filters = [dropShadowFilter];

    const woodedAreas = [
        woodedArea(4, 64, 0, 0x74C040),
        woodedArea(16, 16, 1, 0x449430),
        woodedArea(84, 8, 2, 0x74C040),
        woodedArea(100, 54, 3, 0x449430)];


    container.sortableChildren = true;
    const tom = worldMapTom(64, 64);

    makePortal(woodedAreas[0], tom, casino);
    makePortal(woodedAreas[1], tom, arena);
    makePortal(woodedAreas[2], tom, theater);
    makePortal(woodedAreas[3], tom, pile);

    woodedAreas.forEach(x => container.addChild(x));
    // tom.filters = [dropShadowFilter];
    container.addChild(tom);

    game.stage.addChild(container);
}

function makePortal(displayObject: DisplayObject, tom: DisplayObject, scene: Scene)
{
    displayObject.withStep(() => {
        if (distance(add(vector(displayObject), { x: 12, y: 24 }), tom) < 12)
            game.goto(scene);
    });
}

function worldMapTom(x, y): DisplayObject
{
    const sprite = Sprite.from(MapTom);
    sprite.x = x;
    sprite.y = y;
    sprite.anchor.set(0.5, 1);

    let hspeed = 0;
    let vspeed = 0;
    let trip = 0;
    let factor = 0;

    sprite.withStep(() => {
        if (Key.isDown("ArrowRight"))
            hspeed = approachLinear(hspeed, 2, 1);
        else if (Key.isDown("ArrowLeft"))
            hspeed = approachLinear(hspeed, -2, 1);
        else
            hspeed = approachLinear(hspeed, 0, 0.5);

        if (Key.isDown("ArrowDown"))
            vspeed = approachLinear(vspeed, 1, 0.5);
        else if (Key.isDown("ArrowUp"))
            vspeed = approachLinear(vspeed, -1, 0.5);
        else
            vspeed = approachLinear(vspeed, 0, 0.25);

        if (hspeed < 0)
            sprite.scale.x = -1;
        else if (hspeed > 0)
            sprite.scale.x = 1;

        const speed = Math.abs(hspeed) + Math.abs(vspeed);
        factor = approachLinear(factor, speed > 0 ? 1 : 0, 0.2);
        trip += speed;
        x += hspeed;
        y += vspeed;

        x = Math.min(game.width, Math.max(0, x));
        y = Math.min(game.height, Math.max(12, y));

        sprite.x = x;
        sprite.y = y + Math.abs(Math.sin(trip * 0.1)) * (-3 * factor);
        sprite.skew.x = factor * Math.cos(trip * 0.2) * 0.1;
        sprite.zIndex = y - 24;
    });
    return sprite;
}

function woodedArea(x, y, index, color)
{
    const sprite = Sprite.from(MapWoodedArea);
    sprite.position.set(x, y);
    sprite.zIndex = y;
    sprite.tint = color;
    return sprite;
}