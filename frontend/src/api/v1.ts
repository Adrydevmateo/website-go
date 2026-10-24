import { GetEnv } from "@utils/config";
import Logger from "@utils/logger";

interface IFetchResult<T> {
	data: T | null;
	ok: boolean;
}

interface IGETResult<T> extends IFetchResult<T> {}

export default class APIv1 {
	async Request<T>(endpoint: string): Promise<IGETResult<T>> {
		try {
			const fetched = await fetch(
				`${GetEnv("VITE_API_URL")}/api/v1${endpoint}`,
			);
			if (!fetched.ok)
				if (fetched.status === 404)
					throw new Error("Could not fetch, url not found");
			return { data: await fetched.json(), ok: true };
		} catch (error: unknown) {
			if (error instanceof Error) Logger.error(error.message);
			return { data: null, ok: false };
		}
	}
}
