import { LoggableError } from "ts4air/shared/errors/LoggableError";
import { formatDiagnostics } from "ts4air/shared/util/formatDiagnostics";
import * as ts from "typescript";

export class DiagnosticError extends LoggableError {
	constructor(public readonly diagnostics: ReadonlyArray<ts.Diagnostic>) {
		super();
	}

	public toString() {
		return formatDiagnostics(this.diagnostics);
	}
}