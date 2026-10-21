import { getEnv } from "waku";
import Logger from "./logger";

interface IFetchResult<T> {
	data: T | null;
	ok: boolean;
}

interface IGETResult<T> extends IFetchResult<T> {}

export async function V1GET<T>(endpoint: string): Promise<IGETResult<T>> {
	try {
		const fetched = await fetch(`${getEnv("API_URL")}/api/v1${endpoint}`);
		if (!fetched.ok)
			if (fetched.status === 404)
				throw new Error("Could not fetch, url not found");
		return { data: await fetched.json(), ok: true };
	} catch (error: unknown) {
		if (error instanceof Error) Logger.error(error.message);
		return { data: null, ok: false };
	}
}

interface IPOSTResult<T> extends IFetchResult<T> {
	message?: string;
}
// TODO: create a config to retrieve environment variables
// TODO: create util to retrieve api version
export async function V1POST<T>(endpoint: string): Promise<IPOSTResult<T>> {
	try {
		const fetched = await fetch(`${getEnv("API_URL")}/api/v1${endpoint}`);
		if (!fetched.ok)
			if (fetched.status === 404)
				throw new Error("Could not fetch, url not found");
		return { data: await fetched.json(), ok: true };
	} catch (error: unknown) {
		if (error instanceof Error) Logger.error(error.message);
		return { data: null, ok: false };
	}
}
