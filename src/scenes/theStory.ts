import {game} from "../tom/game";
import { TilingSprite, Text } from "pixi.js";
import {Stars} from "../textures";
import {SerifFont} from "../fonts";
import {EscapeTickerAndExecute} from "../utils/iguaTicker";
import {worldMap} from "./worldMap";

export function theStory()
{
    game.hudStage.visible = false;
    game.stage.addChild(new TilingSprite(Stars, game.width, game.height));
    const text = new Text( "Ah... The six wooded areas... Most who visit even one of them never returns... There are many goblins and eveil elves there... You wish to see the willow? Then I guess you will have to brave this challenge, Hoppin Tom...",
        {
            fontFamily: SerifFont,
            fontSize: 16,
            fill: 0xffff00,
            wordWrap: true,
            wordWrapWidth: game.width
        })
        .withStep(() => {
            text.y -= 0.2;
            if (text.y + text.height < 0)
                throw new EscapeTickerAndExecute(() => game.goto(worldMap));
        });
    text.y = game.height;
    game.stage.addChild(text);
}