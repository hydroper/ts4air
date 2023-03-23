import * as kleur from 'kleur';
import { SourceFileWithTextRange } from 'ts4air/shared/types';
import { createDiagnosticWithLocation } from 'ts4air/shared/util/createDiagnosticWithLocation';
import { createTextDiagnostic } from 'ts4air/shared/util/createTextDiagnostic';
import * as ts from 'typescript';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DiagnosticFactory<T extends Array<any> = []> = {
	(node: ts.Node | SourceFileWithTextRange, ...context: T): ts.DiagnosticWithLocation;
	id: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DiagnosticContextFormatter<T extends Array<any> = []> = (...context: T) => Array<string | false>;

const REPO_URL = "https://github.com/hydroper/ts4air";

function suggestion(text: string) {
	return "Suggestion: " + kleur.yellow(text);
}

function issue(id: number) {
	return "More information: " + kleur.grey(`${REPO_URL}/issues/${id}`);
}

let id = 0;

/**
 * Returns a `DiagnosticFactory` that includes a function used to generate a readable message for the diagnostic.
 * @param messages The list of messages to include in the error report.
 */
function diagnostic(category: ts.DiagnosticCategory, ...messages: Array<string | false>): DiagnosticFactory {
	return diagnosticWithContext(category, undefined, ...messages);
}

/**
 * Returns a `DiagnosticFactory` that includes a function used to generate a readable message for the diagnostic.
 * The context is additonal data from the location where the diagnostic occurred that is used to generate dynamic
 * messages.
 * @param contextFormatter An optional function to format the context parameter for this diagnostic. The returned
 * formatted messages are displayed last in the diagnostic report.
 * @param messages The list of messages to include in the diagnostic report.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function diagnosticWithContext<T extends Array<any> = []>(
	category: ts.DiagnosticCategory,
	contextFormatter?: DiagnosticContextFormatter<T>,
	...messages: Array<string | false>
): DiagnosticFactory<T> {
	const result = (node: ts.Node | SourceFileWithTextRange, ...context: T) => {
		if (category === ts.DiagnosticCategory.Error) {
			debugger;
		}

		if (contextFormatter) {
			messages.push(...contextFormatter(...context));
		}

		return createDiagnosticWithLocation(result.id, messages.filter(v => v !== false).join("\n"), category, node);
	};
	result.id = id++;
	return result;
}

function diagnosticText(category: ts.DiagnosticCategory, ...messages: Array<string | false>) {
	return createTextDiagnostic(messages.filter(v => v !== false).join("\n"), category);
}

function error(...messages: Array<string | false>): DiagnosticFactory {
	return diagnostic(ts.DiagnosticCategory.Error, ...messages);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function errorWithContext<T extends Array<any> = []>(
	contextFormatter: DiagnosticContextFormatter<T>,
	...messages: Array<string | false>
): DiagnosticFactory<T> {
	return diagnosticWithContext(ts.DiagnosticCategory.Error, contextFormatter, ...messages);
}

function errorText(...messages: Array<string>) {
	return diagnosticText(ts.DiagnosticCategory.Error, ...messages);
}

function warning(...messages: Array<string>): DiagnosticFactory {
	return diagnostic(ts.DiagnosticCategory.Warning, ...messages);
}

function warningText(...messages: Array<string>) {
	return diagnosticText(ts.DiagnosticCategory.Warning, ...messages);
}

export function getDiagnosticId(diagnostic: ts.Diagnostic): number {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (diagnostic as any).id;
}

/**
 * Defines diagnostic error messages
 */
export const errors = {
	// foo error
	noFooError: error(
		"Some message.",
	),
};

export const warnings = {
	truthyChange: (checksStr: string) => warning(`Value will be checked against ${checksStr}`),
	stringOffsetChange: (text: string) => warning(`String macros no longer offset inputs: ${text}`),
	transformerNotFound: (name: string, err: unknown) =>
		warningText(
			`Transformer \`${name}\` was not found!`,
			"More info: " + err,
			suggestion("Did you forget to install the package?"),
		),
	someFooWarning: warning(
		"Some foo warning.",
	),
};