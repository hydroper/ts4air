export class Ts2SwfError extends Error {
    constructor(public kind: Ts2SwfErrorKind)  {
        super(getErrorMessage(kind));
    }
}

export type Ts2SwfErrorKind
    = 'noTSConfig'
    | 'noEntryTS';

const errorMessages = new Map<Ts2SwfErrorKind, string>([
    ['noTSConfig', 'Unable to find tsconfig.json.'],
    ['noEntryTS', 'Unable to find entry program.'],
]);

function getErrorMessage(kind: Ts2SwfErrorKind): string {
    return errorMessages.get(kind);
}