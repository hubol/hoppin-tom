import {startApplication} from "../utils/pixiUtils";
import {Container, DisplayObject, Ticker} from "pixi.js";
import {IguaTicker} from "../utils/iguaTicker";
import {theStory} from "../scenes/theStory";
import {worldMap} from "../scenes/worldMap";

export let game: Game;

export function startGame()
{
    game = createGame();
    // game.goto(theStory);
    game.goto(worldMap);
}

function createGame(): Game
{
    const application = startApplication({ width: 128, height: 128, targetFps: 60 });
    application.ticker = new IguaTicker();
    application.ticker.start();

    const stage = new Container();
    const hudStage = new Container();
    application.stage.addChild(stage, hudStage);

    const game = {
        hudStage,
        stage,
        get ticker() {
            return application.ticker;
        },
        camera: createCamera(application.stage),
        get backgroundColor() {
            return application.renderer.backgroundColor;
        },
        set backgroundColor(value) {
            application.renderer.backgroundColor = value;
        },
        get width() {
            return application.renderer.width;
        },
        get height() {
            return application.renderer.height;
        },
        goto(scene: () => void) {
            stage.removeChildren();
            stage.visible = true;
            hudStage.visible = true;
            game.camera.x = 0;
            game.camera.y = 0;
            game.backgroundColor = 0x333333;
            scene();
        }
    };

    return game;
}

function createCamera(displayObject: DisplayObject)
{
    return {
        get x() {
            return -displayObject.x;
        },
        get y() {
            return -displayObject.y;
        },
        set x(value) {
            displayObject.x = -value;
        },
        set y(value) {
            displayObject.y = -value;
        },
    };
}

interface Game
{
    hudStage: Container;
    stage: Container;
    ticker: Ticker;
    camera: Camera;
    backgroundColor: number;
    width: number;
    height: number;
    goto(scene: () => void);
}

interface Camera
{
    x: number;
    y: number;
}