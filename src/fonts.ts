import {FontFamilyName, loadGoogleFontAsync} from "./utils/loadGoogleFont";

export let SerifFont: FontFamilyName;
export let SansSerifFont: FontFamilyName;

export async function loadFontsAsync()
{
    SerifFont = await loadGoogleFontAsync("Roboto Slab");
    SansSerifFont = await loadGoogleFontAsync("Jost");
}