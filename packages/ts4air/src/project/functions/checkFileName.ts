import * as path from "path";
import { FILENAME_WARNINGS } from "ts4air/shared/constants";
import { errors } from "ts4air/shared/diagnostics";
import { DiagnosticService } from "ts4air/tstransformer/classes/diagnosticService";

export function checkFileName(filePath: string) {
	const baseName = path.basename(filePath);
	const nameWarning = FILENAME_WARNINGS.get(baseName);
	if (nameWarning) {
		DiagnosticService.addDiagnostic(errors.incorrectFileName(baseName, nameWarning, filePath));
	}
}