import { DiagnosticError } from "ts4air/shared/errors/DiagnosticError";
import { createTextDiagnostic } from "ts4air/shared/util/createTextDiagnostic";

export class ProjectError extends DiagnosticError {
	constructor(message: string) {
		super([createTextDiagnostic(message)]);
	}
}