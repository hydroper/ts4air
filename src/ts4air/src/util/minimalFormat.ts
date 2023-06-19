/**
 * Formats simple string parameters.
 * # Examples
 * ```ts
 * minimalFormat('$a', {a: 'foo'})
 * minimalFormat('$<hyphens-n_Underscores>', {'hyphens-n_Underscores': ''})
 * minimalFormat('$$', {}) // '$'
 * ```
 */
export default function minimalFormat(base: string, argumentsObject: any): string {
    argumentsObject ??= {};
    if (argumentsObject instanceof Array) {
        let array = argumentsObject;
        argumentsObject = {};
        let i = 0;
        for (let v of array) {
            argumentsObject[(++i).toString()] = v;
        }
    }
    else if (argumentsObject instanceof Map) {
        argumentsObject = Object.fromEntries(argumentsObject.entries());
    }
    return base.replace(/\$([a-z0-9]+|\<[a-z0-9\-_]+\>|\$)/gi, (_, s: string, _r) => {
        return s == '$' ? '$' : String(argumentsObject[s.replace('<', '').replace('>', '')]);
    });
}