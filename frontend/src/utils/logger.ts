const allowedLevels = process.env.LOGGER_ALLOWED_LEVELS || ["warn", "error"];

const Logger = {
	debug: (msg: string, ...args: unknown[]) => {
		if (allowedLevels.includes("debug"))
			console.debug(`[DEBUG]: ${msg}`, ...args);
	},
	info: (msg: string, ...args: unknown[]) => {
		if (allowedLevels.includes("info")) console.info(`[INFO]: ${msg}`, ...args);
	},
	warn: (msg: string, ...args: unknown[]) => {
		if (allowedLevels.includes("warn")) console.warn(`[WARN]: ${msg}`, ...args);
	},
	error: (msg: string, ...args: unknown[]) => {
		if (allowedLevels.includes("error"))
			console.error(`[ERROR]: ${msg}`, ...args);
	},
};

export default Logger;
