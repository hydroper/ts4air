import * as colorconvert from 'color-convert';

export function rgb(argument: number | string): number {
    if (typeof argument == 'number') {
        return argument;
    }
    let [r, g, b] = argument.startsWith('#') ? colorconvert.hex.rgb(argument) : colorconvert.keyword.rgb(argument as any);
    return (r << 16) | (g << 8) | b;
}