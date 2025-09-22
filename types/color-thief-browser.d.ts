declare module 'color-thief-browser' {
  export default class ColorThief {
    getColor(img: HTMLImageElement): Promise<[number, number, number]>;
    getPalette(img: HTMLImageElement, colorCount?: number): Promise<[number, number, number][]>;
  }
}