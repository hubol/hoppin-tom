import * as PIXI from "pixi.js";
    
// This file is generated. Do not touch.

export let ArenaBackground: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let AudienceElf2: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let AudienceElf: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let CasinoBackground: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let CasinoExitSign: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let Checkpoint: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let Goblim: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let HdTom: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let MagicLetters: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let MapBackground: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let MapTom: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let MapWoodedArea: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let PileBackground: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let PileTom: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let PixelArtTom: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let RandomSymbols: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let SingingTom: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let SmallTom: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let SpinButton: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let Stars: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let TheaterBackground: PIXI.Texture = undefined as unknown as PIXI.Texture;
export let WillowTree: PIXI.Texture = undefined as unknown as PIXI.Texture;


export function loadTexturesAsync()
{
    const loader = new PIXI.Loader();

    const ArenaBackgroundPath = require("./images/arena background.png");
    loader.add(ArenaBackgroundPath); 

    const AudienceElf2Path = require("./images/audience elf 2.png");
    loader.add(AudienceElf2Path); 

    const AudienceElfPath = require("./images/audience elf.png");
    loader.add(AudienceElfPath); 

    const CasinoBackgroundPath = require("./images/casino background.png");
    loader.add(CasinoBackgroundPath); 

    const CasinoExitSignPath = require("./images/casino exit sign.png");
    loader.add(CasinoExitSignPath); 

    const CheckpointPath = require("./images/checkpoint.png");
    loader.add(CheckpointPath); 

    const GoblimPath = require("./images/goblim.png");
    loader.add(GoblimPath); 

    const HdTomPath = require("./images/hd tom.png");
    loader.add(HdTomPath); 

    const MagicLettersPath = require("./images/magic letters.png");
    loader.add(MagicLettersPath); 

    const MapBackgroundPath = require("./images/map background.png");
    loader.add(MapBackgroundPath); 

    const MapTomPath = require("./images/map tom.png");
    loader.add(MapTomPath); 

    const MapWoodedAreaPath = require("./images/map wooded area.png");
    loader.add(MapWoodedAreaPath); 

    const PileBackgroundPath = require("./images/pile background.png");
    loader.add(PileBackgroundPath); 

    const PileTomPath = require("./images/pile tom.png");
    loader.add(PileTomPath); 

    const PixelArtTomPath = require("./images/pixel art tom.png");
    loader.add(PixelArtTomPath); 

    const RandomSymbolsPath = require("./images/random symbols.png");
    loader.add(RandomSymbolsPath); 

    const SingingTomPath = require("./images/singing tom.png");
    loader.add(SingingTomPath); 

    const SmallTomPath = require("./images/small tom.png");
    loader.add(SmallTomPath); 

    const SpinButtonPath = require("./images/spin button.png");
    loader.add(SpinButtonPath); 

    const StarsPath = require("./images/stars.png");
    loader.add(StarsPath); 

    const TheaterBackgroundPath = require("./images/theater background.png");
    loader.add(TheaterBackgroundPath); 

    const WillowTreePath = require("./images/willow tree.png");
    loader.add(WillowTreePath); 

    
    return new Promise(resolve =>
    {
        loader.load((_, resources) => {
            ArenaBackground = resources[ArenaBackgroundPath]?.texture as PIXI.Texture;
            AudienceElf2 = resources[AudienceElf2Path]?.texture as PIXI.Texture;
            AudienceElf = resources[AudienceElfPath]?.texture as PIXI.Texture;
            CasinoBackground = resources[CasinoBackgroundPath]?.texture as PIXI.Texture;
            CasinoExitSign = resources[CasinoExitSignPath]?.texture as PIXI.Texture;
            Checkpoint = resources[CheckpointPath]?.texture as PIXI.Texture;
            Goblim = resources[GoblimPath]?.texture as PIXI.Texture;
            HdTom = resources[HdTomPath]?.texture as PIXI.Texture;
            MagicLetters = resources[MagicLettersPath]?.texture as PIXI.Texture;
            MapBackground = resources[MapBackgroundPath]?.texture as PIXI.Texture;
            MapTom = resources[MapTomPath]?.texture as PIXI.Texture;
            MapWoodedArea = resources[MapWoodedAreaPath]?.texture as PIXI.Texture;
            PileBackground = resources[PileBackgroundPath]?.texture as PIXI.Texture;
            PileTom = resources[PileTomPath]?.texture as PIXI.Texture;
            PixelArtTom = resources[PixelArtTomPath]?.texture as PIXI.Texture;
            RandomSymbols = resources[RandomSymbolsPath]?.texture as PIXI.Texture;
            SingingTom = resources[SingingTomPath]?.texture as PIXI.Texture;
            SmallTom = resources[SmallTomPath]?.texture as PIXI.Texture;
            SpinButton = resources[SpinButtonPath]?.texture as PIXI.Texture;
            Stars = resources[StarsPath]?.texture as PIXI.Texture;
            TheaterBackground = resources[TheaterBackgroundPath]?.texture as PIXI.Texture;
            WillowTree = resources[WillowTreePath]?.texture as PIXI.Texture;

            resolve();
        });
    });
}