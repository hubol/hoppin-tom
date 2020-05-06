import {startApplication} from "../utils/pixiUtils";
import {Container, DisplayObject, Ticker} from "pixi.js";
import {EscapeTickerAndExecute, IguaTicker} from "../utils/iguaTicker";
import {theStory} from "../scenes/theStory";
import {worldMap} from "../scenes/worldMap";
import {casino} from "../scenes/casino";
import {hud, Hud} from "./hud";
import {congrats} from "../scenes/congrats";
import {arena} from "../scenes/arena";
import {advanceKeyListener, startKeyListener} from "../utils/key";

export let game: Game;

export function startGame()
{
    game = createGame();
    game.goto(theStory, { escapeTicker: false });
    game.hud.addL();
    game.hud.addL();
    // game.hud.addI();
    game.hud.addO();
    // game.goto(congrats, { escapeTicker: false });
    // game.goto(arena, { escapeTicker: false });
    // game.goto(worldMap, { escapeTicker: false });
}

function createGame(): Game
{
    const application = startApplication({ width: 128, height: 128 });

    application.ticker.maxFPS = 60;
    application.ticker.start();

    const iguaTicker = new IguaTicker();

    startKeyListener();
    iguaTicker.add(advanceKeyListener);

    application.ticker.add(() => iguaTicker.update());

    const stage = new Container();
    const hudStage = new Container();
    application.stage.addChild(stage, hudStage);

    const theHud = hud();
    theHud.position.set(0, 112);
    hudStage.addChild(theHud);

    const gotoImpl = (scene: Scene) =>
    {
        application.ticker.stop();
        window.setTimeout(() => {
            stage.removeAllChildren();
            stage.visible = true;
            hudStage.visible = true;
            game.camera.x = 0;
            game.camera.y = 0;
            game.backgroundColor = 0x333333;
            const sceneResult = scene();
            if (sceneResult instanceof Promise)
                sceneResult.then(() => {
                    application.ticker.start()
                });
            else
                application.ticker.start();
        })
    };

    const game = {
        hudStage,
        stage,
        get ticker() {
            return iguaTicker;
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
        goto(scene: Scene, gotoOptions?: GotoOptions) {
            if (gotoOptions?.escapeTicker ?? true)
                throw new EscapeTickerAndExecute(() => gotoImpl(scene));
            else
                gotoImpl(scene);
        },
        hud: theHud
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

interface GotoOptions
{
    escapeTicker?: boolean;
}

export type Scene = () => void | Promise<void>;

interface Game
{
    hudStage: Container;
    stage: Container;
    ticker: Ticker;
    camera: Camera;
    backgroundColor: number;
    width: number;
    height: number;
    goto(scene: Scene, gotoOptions?: GotoOptions);
    hud: Hud & Container;
}

interface Camera
{
    x: number;
    y: number;
}