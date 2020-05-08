import { DisplayObject, Sprite, Container, Graphics } from "pixi.js";
import {subimageTextures} from "../utils/simpleSpritesheet";
import {Checkpoint, PileBackground, PileTom} from "../textures";
import {Key} from "../utils/key";
import {game} from "../tom/game";
import {approachLinear, toRad} from "../utils/math";
import {add, distance, len, normalize, scale, set, sub, vector, Vector} from "../utils/vector";
import {merge} from "../utils/merge";
import {stopMusic} from "../playMusic";
import {magicLetter} from "../tom/hud";
import {worldMap} from "./worldMap";
import {EvilBallHurt, Engine, GoblimBounce} from "../sounds";

let tom: Tom;
let bottom: number;

export function pile()
{
    stopMusic();
    bottom = game.height - 20;
    tom = createTom().at(8, 8);
    game.stage.addChild(Sprite.from(PileBackground), tom);

    if (!game.hud.hasO())
    {
        const evilBall = createEvilBall().at(game.width / 2, bottom / 2);
        game.stage.addChild(evilBall);
    }
    else
    {
        const exit = Sprite.from(Checkpoint).withStep(() => {
            if (tom.collides(exit))
                game.goto(worldMap);
        }).at(game.width / 2, bottom / 2);

        exit.anchor.set(0.5, 0.5);
        game.stage.addChild(exit);
    }
}

const pileTomTextures = subimageTextures(PileTom, 2);

function createTom(): Tom
{
    Engine.loop(true);
    Engine.volume(0);
    Engine.rate(0.5);
    Engine.play();

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

        const velocity = len(speed);
        Engine.volume(approachLinear(Engine.volume(), velocity / 5, 0.2));
        Engine.rate(approachLinear(Engine.rate(), 1 + (velocity / 5) * 1, 0.2));

        sprite.x += speed.x;
        sprite.y += speed.y;

        scale(speed, 0.95);

        if (sprite.x < 0)
        {
            sprite.x = 0;
            speed.x *= -bounceFactor;
            GoblimBounce.play();
        }
        if (sprite.y < 0)
        {
            sprite.y = 0;
            speed.y *= -bounceFactor;
            GoblimBounce.play();
        }
        if (sprite.x > game.width)
        {
            sprite.x = game.width;
            speed.x *= -bounceFactor;
            GoblimBounce.play();
        }
        if (sprite.y > bottom)
        {
            sprite.y = bottom;
            speed.y *= -bounceFactor;
            GoblimBounce.play();
        }
    });

    sprite.on("removed", () => Engine.stop());

    return merge(sprite, { speed });
}

interface TomProps
{
    speed: Vector;
}

type Tom = DisplayObject & TomProps;

function createEvilBall()
{
    let life = 100;

    function getRadius()
    {
        return Math.max(0, life / 100 * 32);
    }

    function getPlayerAffectedRadius()
    {
        return getRadius() + 5;
    }

    function isMagicLetterExposed()
    {
        return getRadius() < 8.5;
    }

    const evilBall = new Container();

    const graphics = new Graphics();
    graphics.withStep(() => {
        graphics.clear();

        if (isMagicLetterExposed())
            return;

        const r = Math.max(9, getRadius());
        graphics.beginFill(0xCEE4FF);
        graphics.drawEllipse(0, 0, r, r);
        graphics.endFill();
    });

    const letter = magicLetter(0, 0, "o");
    letter.anchor.set(0.5, 0.5);

    evilBall.addChild(graphics, letter);

    evilBall.withStep(() => {
        const offset = sub(vector(tom), evilBall);
        if (len(offset) >= getPlayerAffectedRadius())
            return;

        if (isMagicLetterExposed())
        {
            game.hud.addO();
            evilBall.destroy();
            goBackToWorldMap();
        }

        EvilBallHurt.rate(.5 + life / 200);
        EvilBallHurt.play();

        const normalizedOffset = normalize(offset);
        add(set(tom, evilBall), normalizedOffset, getPlayerAffectedRadius());

        const tomVelocity = len(tom.speed);
        life -= tomVelocity;
        set(tom.speed, scale(normalizedOffset, (tomVelocity * 2 + 5)));
    });

    return evilBall;
}

async function goBackToWorldMap()
{
    await shrink(tom);
    game.goto(worldMap, { escapeTicker: false });
}

function shrink(displayObject: DisplayObject)
{
    return new Promise<void>(resolve => {
        game.stage.addChild(new DisplayObject().withStep(() => {
            displayObject.scale.x *= 0.95;
            displayObject.scale.y *= 0.95;
            if (Math.abs(displayObject.scale.x) < 0.01 || Math.abs(displayObject.scale.y) < 0.01)
                resolve();
        }));
    });
}