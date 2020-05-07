import { DisplayObject, Sprite } from "pixi.js";
import {subimageTextures} from "../utils/simpleSpritesheet";
import {PileBackground, PileTom} from "../textures";
import {Key} from "../utils/key";
import {game} from "../tom/game";
import {toRad} from "../utils/math";
import {len, normalize, scale, Vector} from "../utils/vector";
import {merge} from "../utils/merge";
import {stopMusic} from "../playMusic";

let tom: Tom;
let bottom: number;

export function pile()
{
    stopMusic();
    bottom = game.height - 20;
    tom = createTom().at(8, 8);
    game.stage.addChild(Sprite.from(PileBackground), tom);
}

const pileTomTextures = subimageTextures(PileTom, 2);

function createTom(): Tom
{
    const sprite = Sprite.from(pileTomTextures[0]);
    sprite.anchor.set(0.5, 0.5);
    const deltaAngle = 4;
    const acceleration = 0.2;
    const bounceFactor = 1.25;

    const speed = { x: 0, y: 0 };

    sprite.withStep(() => {
        if (Key.isDown("ArrowLeft"))
            sprite.angle -= deltaAngle;
        if (Key.isDown("ArrowRight"))
            sprite.angle += deltaAngle;

        if (Key.isDown("ArrowUp"))
        {
            const radians = (-sprite.angle) * toRad;
            speed.x += Math.cos(radians) * acceleration;
            speed.y -= Math.sin(radians) * acceleration;
        }

        if (len(speed) > 5)
            scale(normalize(speed), 5);

        sprite.x += speed.x;
        sprite.y += speed.y;

        scale(speed, 0.95);

        if (sprite.x < 0)
        {
            sprite.x = 0;
            speed.x *= -bounceFactor;
        }
        if (sprite.y < 0)
        {
            sprite.y = 0;
            speed.y *= -bounceFactor;
        }
        if (sprite.x > game.width)
        {
            sprite.x = game.width;
            speed.x *= -bounceFactor;
        }
        if (sprite.y > bottom)
        {
            sprite.y = bottom;
            speed.y *= -bounceFactor;
        }
    });

    return merge(sprite, { speed });
}

interface TomProps
{
    speed: Vector;
}

type Tom = DisplayObject & TomProps;