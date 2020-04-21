import {startApplication} from "../utils/pixiUtils";
import {Container, DisplayObject, Ticker} from "pixi.js";
import {IguaTicker} from "../utils/iguaTicker";

export let game: Game;

export function startGame()
{
    const application = startApplication({ width: 256, height: 256, targetFps: 60 });
    application.ticker = new IguaTicker();
    application.ticker.autoStart = true;

    const stage = new Container();
    const hudStage = new Container();
    application.stage.addChild(stage, hudStage);

    game = {
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
        }
    };
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
}

interface Camera
{
    x: number;
    y: number;
}