import {wait} from "./utils/wait";

let currentlyPlayingMusic: CurrentlyPlayingMusic | null = null;

let tryingToPlayMusic = false;

export async function playMusicAsync(howl: Howl)
{
    await wait(() => !tryingToPlayMusic);

    tryingToPlayMusic = true;
    const wasLoadedByPlayMusic = howl.state() === "unloaded";
    howl.load();
    await wait(() => howl.state() === "loaded");
    howl.loop(true);
    howl.play();

    if (currentlyPlayingMusic?.wasLoadedByPlayMusic)
        currentlyPlayingMusic.howl.unload();

    currentlyPlayingMusic = { howl, wasLoadedByPlayMusic };
    tryingToPlayMusic = false;
}

interface CurrentlyPlayingMusic
{
    howl: Howl;
    wasLoadedByPlayMusic: boolean;
}