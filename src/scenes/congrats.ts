import {game} from "../tom/game";
import {Sprite, Graphics, Container, Text} from "pixi.js";
import {HdTom, WillowTree} from "../textures";
import {Key} from "../utils/key";
import {approachLinear} from "../utils/math";
import {SerifFont} from "../fonts";

export function congrats()
{
    // TODO play music

    game.backgroundColor = 0x1044ff;
    game.hudStage.visible = false;

    const willowTree = new Sprite(WillowTree);
    willowTree.scale.set(0.9, 0.8);
    willowTree.anchor.set(0.5, -0.05);
    willowTree.position.set(game.width / 2, 0);

    const graphics = new Graphics();
    graphics.beginFill(0xff4410);
    graphics.drawEllipse(game.width / 2, game.height, game.width / 2, 32);
    graphics.endFill();

    const player = new Container();
    const tom = new Sprite(HdTom);
    tom.anchor.set(0.5, 1);
    tom.scale.set(0.2, 0.2);

    const shadow = new Graphics();
    shadow.beginFill(0x882208);
    shadow.drawEllipse(0, 0, 8, 3);
    shadow.endFill();

    player.addChild(shadow, tom);
    let i = Math.PI / -2.1;
    let f = 0;
    let big = 0;
    player.withStep(() => {
        const rightDown = Key.isDown("ArrowRight");
        const leftDown = Key.isDown("ArrowLeft");

        if (rightDown)
            i += 0.1;
        if (leftDown)
            i -= 0.1;

        big = approachLinear(big, Key.isDown("ArrowUp") ? 1 : 0, 0.2);

        f = approachLinear(f, (rightDown || leftDown) ? 1 : 0, 0.3);

        const xprev = player.x;
        player.position.set(game.width / 2 - Math.cos(i) * 30, 106 - Math.sin(i) * 10);
        if (player.x < xprev)
            player.scale.x = -Math.abs(player.scale.x);
        else if (player.x > xprev)
            player.scale.x = Math.abs(player.scale.x);

        const bigScale = 1 + big;
        player.scale.set(Math.sign(player.scale.x) * bigScale, bigScale);

        tom.y = f * Math.abs(Math.sin(i * 2)) * -5;
        player.zIndex = player.y;
    });

    const stupid = new Container();
    willowTree.zIndex = 106;
    stupid.addChild(willowTree, player);
    stupid.sortableChildren = true;

    const text = new Text(
`When the balls were united
It was said
The path would be opened
to the Willow called Ted

****

"Who goes there?"
Willow Ted said
"It's me, Hoppin' Tom"
spoke Tom, now well-fed

"What do you seek?"
quoth the Willow
"What DON'T I seek!"
shouted our green fellow

"The wooded areas
gave me such scareas!
I was worried
I might lose all my haireas!"

"I got so cold and
I got so hot!
I was quite nervous
that I might get shot!"

"Shit has been real
and, frankly, I'm tired!
I'd like to curl up
around a warm, cozy fire!"

"So please Willow Ted,
let me rest,
I hope I did well
on your sacred test!"

"Oh Tom,"
began the Willow.
"Let's chill here,
for real though."

****

FIN`,
        {
            fontFamily: SerifFont,
            fontSize: 9.25,
            fill: 0xffff00,
            wordWrap: true,
            wordWrapWidth: game.width
        })
        .withStep(() => {
            text.y -= 0.1;
            if (text.y <= 50 && !coolContainer.visible)
            {
                coolContainer.visible = true;
                // TODO sfx
            }
        });
    text.y = game.height;

    const coolContainer = new Container();
    coolContainer.addChild(graphics, stupid);
    coolContainer.visible = false;

    game.stage.addChild(coolContainer, text);
}