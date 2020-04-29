import {wait} from "./utils/wait";
import {sleep} from "./utils/sleep";

let currentlyPlayingMusic: CurrentlyPlayingMusic | null = null;

let tryingToPlayMusic = false;

export async function playMusicAsync(howl: Howl)
{
    await wait(() => !tryingToPlayMusic);
    if (howl === currentlyPlayingMusic?.howl)
        return;

    tryingToPlayMusic = true;
    try
    {
        const wasLoadedByPlayMusic = howl.state() === "unloaded";
        const onLoadPromise = new Promise(resolve => { howl.once("load", resolve) });
        howl.load();
        await Promise.race([onLoadPromise, wait(() => howl.state() === "loaded"), sleep(5000)]);
        howl.loop(true);
        howl.play();

        if (currentlyPlayingMusic?.wasLoadedByPlayMusic)
            currentlyPlayingMusic.howl.unload();

        currentlyPlayingMusic = { howl, wasLoadedByPlayMusic };
    }
    catch (e)
    {
        console.error("An error occurred while trying to play music", howl, e);
    }
    finally
    {
        tryingToPlayMusic = false;
    }
}

interface CurrentlyPlayingMusic
{
    howl: Howl;
    wasLoadedByPlayMusic: boolean;
}