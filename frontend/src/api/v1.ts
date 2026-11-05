import type { TFormError } from "@contracts/form";
import { GetEnv } from "@utils/config";
import Logger from "@utils/logger";

export interface ISignInResponse {
	ok: boolean;
	data?: string;
	error?: TFormError;
}

export async function SignIn(
	email: string,
	password: string,
): Promise<ISignInResponse> {
	try {
		const fetched = await fetch(`${GetEnv("VITE_API_URL")}/api/v1/signin`, {
			method: "POST",
			body: JSON.stringify({ email, password }),
		});
		const res: string = await fetched.text();
		if (!fetched.ok) {
			if (res.includes("email"))
				return {
					ok: false,
					error: { field: "email", type: "incorrect-value" },
				};
			if (res.includes("password"))
				return {
					ok: false,
					error: { field: "password", type: "incorrect-value" },
				};
			throw new Error(fetched.statusText);
		}
		return { ok: true, data: res };
	} catch (error) {
		if (error instanceof Error) Logger.Error(error.message);
		return { ok: false };
	}
}
