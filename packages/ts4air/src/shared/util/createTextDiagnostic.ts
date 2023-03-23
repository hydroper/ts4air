import * as ts from "typescript";

export function createTextDiagnostic(
	messageText: string,
	category: ts.DiagnosticCategory = ts.DiagnosticCategory.Error,
): ts.Diagnostic {
	return {
		category,
		code: " ts4air" as unknown as number,
		file: undefined,
		messageText,
		start: undefined,
		length: undefined,
	};
}