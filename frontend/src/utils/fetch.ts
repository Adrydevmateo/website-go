import Logger from "./logger";

interface IFetchResult<T> {
	data: T | null;
	ok: boolean;
}

export default async function FetchUtil<T>(
	endpoint: string,
): Promise<IFetchResult<T>> {
	try {
		const fetched = await fetch(`${process.env.API_URL}${endpoint}`);
		if (!fetched.ok)
			if (fetched.status === 404)
				throw new Error("Could not fetch, url not found");
		return { data: await fetched.json(), ok: true };
	} catch (error: unknown) {
		if (error instanceof Error) Logger.error(error.message);
		return { data: null, ok: false };
	}
}
