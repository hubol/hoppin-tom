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

        stopMusic();

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

export function stopMusic()
{
    if (currentlyPlayingMusic)
    {
        if (currentlyPlayingMusic.wasLoadedByPlayMusic)
            currentlyPlayingMusic.howl.unload();
        else
            currentlyPlayingMusic.howl.stop();
    }
    currentlyPlayingMusic = null;
}

interface CurrentlyPlayingMusic
{
    howl: Howl;
    wasLoadedByPlayMusic: boolean;
}