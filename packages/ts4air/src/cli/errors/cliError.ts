import { DiagnosticError } from 'ts4air/shared/errors/DiagnosticError';
import { createTextDiagnostic } from 'ts4air/shared/util/createTextDiagnostic';

export class CLIError extends DiagnosticError {
	constructor(message: string) {
		super([createTextDiagnostic(message)]);
	}
}