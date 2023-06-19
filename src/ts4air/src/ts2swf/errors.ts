export class Ts2SwfError extends Error {
    constructor(public kind: Ts2SwfErrorKind)  {
        super(getErrorMessage(kind));
    }
}

export type Ts2SwfErrorKind
    = 'noTSConfig'
    | 'noEntryTS'
    | 'npmDepsNotInstalled';

const errorMessages = new Map<Ts2SwfErrorKind, string>([
    ['noTSConfig', 'Unable to find tsconfig.json.'],
    ['noEntryTS', 'Unable to find entry program.'],
    ['npmDepsNotInstalled', 'NPM dependencies are not installed.'],
]);

function getErrorMessage(kind: Ts2SwfErrorKind): string {
    return errorMessages.get(kind);
}