import { AuthTokenAtom } from "@lib/jotai/auth";
import {
	AddNotification,
	NotificationsPollAtom,
} from "@lib/jotai/notification";
import { GetEnv } from "@utils/config";
import Logger from "@utils/logger";
import { useAtom, useSetAtom } from "jotai";

interface IProps {
	activeForm: "sign-in" | "sign-up" | "forgot-password";
}
// TODO: use form hook
export default function AuthForm(prop: IProps) {
	const isSignInActive = prop.activeForm === "sign-in";
	const isSignUpActive = prop.activeForm === "sign-up";
	const isForgotPasswordActive = prop.activeForm === "forgot-password";

	const setAuthToken = useSetAtom(AuthTokenAtom);

	async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = new FormData(e.target);
		const email = String(form.get("email"));
		const password = String(form.get("password"));
		if (!email || !password) {
			if (!email) AddNotification({ title: "Email is required", type: "info" });
			if (!password)
				AddNotification({ title: "Password is required", type: "info" });
			return;
		}
		if (isSignInActive) {
			const jwt = await SignInRequest({ email, password });
			setAuthToken(jwt);
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
			{!isForgotPasswordActive && (
				<input
					type="text"
					name="password"
					id="password"
					placeholder="*******"
				/>
			)}
			{isSignUpActive && (
				<input
					type="text"
					name="password-confirmation"
					id="password-confirmation"
					placeholder="Confirm password"
				/>
			)}
			<button type="submit">Send</button>
		</form>
	);
}

interface ISignInRequest {
	email: string;
	password: string;
}

async function SignInRequest(prop: ISignInRequest) {
	try {
		const fetched = await fetch(`${GetEnv("VITE_API_URL")}/api/v1/signin`, {
			method: "POST",
			body: JSON.stringify({
				email: prop.email,
				password: prop.password,
			}),
		});
		if (!fetched.ok) throw new Error("Could not signin");
		const jwt = await fetched.text();
		return jwt;
	} catch (error: unknown) {
		if (error instanceof Error) Logger.error(error.message);
		return;
	}
}
