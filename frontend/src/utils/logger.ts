import { GetEnv } from "./config";

const allowedLevels = GetEnv("VITE_LOGGER_ALLOWED_LEVELS") || [
	"table",
	"warn",
	"error",
];

const Logger = {
	Table<T>(msg: T) {
		if (allowedLevels.includes("table")) console.table(`[DEBUG]:\n${msg}`);
	},
	Info<T>(msg: T) {
		if (allowedLevels.includes("info")) console.info(`[INFO]: ${msg}`);
	},
	Warn<T>(msg: T) {
		if (allowedLevels.includes("warn")) console.warn(`[WARN]: ${msg}`);
	},
	Error<T>(msg: T) {
		if (allowedLevels.includes("error")) console.error(`[ERROR]: ${msg}`);
	},
};

export default Logger;
