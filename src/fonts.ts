import {FontFamilyName, loadGoogleFontAsync} from "./utils/loadGoogleFont";

export let SerifFont: FontFamilyName;

export async function loadFontsAsync()
{
    SerifFont = await loadGoogleFontAsync("Roboto Slab");
}