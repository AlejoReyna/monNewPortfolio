export const WALLPAPERS = ["/focal.png", "/shadersmine.png"] as const;

export const SHADERSMINE_WALLPAPER = WALLPAPERS[1];
export const WALLPAPER_STORAGE_KEY = "hero-wallpaper";
export const HIDE_HERO_SIDEBAR_CLASS = "hide-hero-sidebar";

export type Wallpaper = (typeof WALLPAPERS)[number];
