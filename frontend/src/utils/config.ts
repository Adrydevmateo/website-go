type TEnvName = "VITE_API_URL" | "VITE_LOGGER_ALLOWED_LEVELS";

export function GetEnv(name: TEnvName) {
	const found = import.meta.env[name];
	if (!found) throw new Error(`${name} not found`);
	return found;
}
