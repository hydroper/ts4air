import minimalFormat from 'ts4air/util/minimalFormat';

export class Ts2SwfError extends Error {
    constructor(public kind: Ts2SwfErrorKind, errorArguments: any = {})  {
        super(minimalFormat(getErrorMessage(kind), errorArguments));
    }
}

export type Ts2SwfErrorKind
    = 'noTSConfig'
    | 'noEntryTS'
    | 'npmDepsNotInstalled'
    | 'externalSWFNotFound';

const errorMessages = new Map<Ts2SwfErrorKind, string>([
    ['noTSConfig', 'Unable to find tsconfig.json.'],
    ['noEntryTS', 'Unable to find entry program.'],
    ['npmDepsNotInstalled', 'NPM dependencies are not installed.'],
    ['externalSWFNotFound', 'External SWF not found: $path.'],
]);

function getErrorMessage(kind: Ts2SwfErrorKind): string {
    return errorMessages.get(kind);
}