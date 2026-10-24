import { AuthTokenAtom } from "@lib/jotai/auth";
import { GetEnv } from "@utils/config";
import Logger from "@utils/logger";
import { useAtom } from "jotai";

export default function AuthForm() {

	return(
		<SignInForm/>
	)
}

function SignInForm() {
	const [authToken, setAuthToken] = useAtom(AuthTokenAtom);

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = new FormData(e.target);
		try {
			const fetched = await fetch(
				`${GetEnv('VITE_API_URL')}/api/v1/signin`,
				{
					method: "POST",
					body: JSON.stringify({
						email: form.get("email"),
						password: form.get("password"),
					}),
				},
			);
			if (!fetched.ok) throw new Error("Could not signin");
			const x = await fetched.text();
			setAuthToken(x)
			console.log(authToken)
			return "success signin";
		} catch (error: unknown) {
			if (error instanceof Error) Logger.error(error.message);
			return;
		}
	}
	return (
		<form onSubmit={handleSubmit}>
			<input
				type="email"
				name="email"
				id="email"
				placeholder="user@gmail.com"
			/>
			<input type="text" name="password" id="password" placeholder="*******" />
			<button type="submit">Sign In</button>
		</form>
	);
}
