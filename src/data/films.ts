/**
 * Brand films, served from R2.
 *
 * Named here rather than typed into each page, so a page asks for a
 * film by name and swapping one is a single edit.
 */

export interface Film {
  poster: string;
  mp4: string;
}

/** The Twin Lights over Highlands. The magazine's own loop. */
export const TWIN_LIGHTS: Film = {
  poster: 'https://site-assets.abovethehook.com/magazine/hero.jpg',
  mp4: 'https://site-assets.abovethehook.com/magazine/hero.mp4',
};

/** The bay at last light — the cut the shop and the master site open on. */
export const BAY_AT_LAST_LIGHT: Film = {
  poster: 'https://site-assets.abovethehook.com/home/hero.jpg',
  mp4: 'https://site-assets.abovethehook.com/home/hero.mp4',
};
