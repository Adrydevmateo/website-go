import { createFileRoute } from "@tanstack/react-router";
import { GetEnv } from "@utils/config";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/auth")({
	component: RouteComponent,
});
type TErrorType = "required" | "incorrect-value" | "incorrect-format";
type TFormError = {
	label: "email" | "password";
	type: TErrorType;
};
function RouteComponent() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [formErrors, setFormErrors] = useState<TFormError[]>([]);
	const [formState, setFormState] = useState<
		"incomplete" | "complete" | "sending" | "idle"
	>("idle");

	interface ISignInResponse {
		ok: boolean;
		data?: string;
		error?: TFormError;
	}

	async function SignIn(
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
						error: { label: "email", type: "incorrect-value" },
					};
				if (res.includes("password"))
					return {
						ok: false,
						error: { label: "password", type: "incorrect-value" },
					};
				throw new Error(fetched.statusText);
			}
			return { ok: true, data: res };
		} catch (error) {
			if (error instanceof Error) {
				// TODO: use logger
				throw new Error(error.message);
			}
			return { ok: false };
		}
	}

	const HandleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFormState("sending");
		if (email.length < 1 || password.length < 1) {
			setFormState("incomplete");
			const tmp: typeof formErrors = formErrors;
			if (email.length < 1)
				if (
					!formErrors.find((f) => f.label === "email" && f.type === "required")
				)
					tmp.push({ label: "email", type: "required" });
			if (password.length < 1)
				if (
					!formErrors.find(
						(f) => f.label === "password" && f.type === "required",
					)
				)
					tmp.push({ label: "password", type: "required" });
			setFormErrors(tmp);
			return;
		}

		const { data, error } = await SignIn(email, password);
		if (error) {
			setFormState("incomplete");
			if (
				!formErrors.find(
					(f) => f.label === error.label && f.type === error.type,
				)
			)
				setFormErrors([...formErrors, error]);
			return;
		}
		if (data) {
			console.log("DATA FROM FETCHING: ", data);
			return;
		}
	};

	const HandleEmailChange = ({
		target,
	}: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
		const currentValue = target.value;
		setEmail(currentValue);
		if (formState === "incomplete")
			if (currentValue.includes("@"))
				setFormErrors(() => formErrors.filter((f) => f.label !== "email"));
	};

	const HandlePasswordChange = ({
		target,
	}: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
		const currentValue = target.value;
		setPassword(currentValue);
		if (formState === "incomplete")
			if (currentValue.length > 3)
				setFormErrors(() => formErrors.filter((f) => f.label !== "password"));
	};

	useEffect(() => {
		if (formErrors.length < 1) setFormState("complete");
	}, [formErrors]);

	return (
		<div>
			{formState === "incomplete" && <p>Incomplete</p>}
			{formErrors.map((m) => (
				<div key={m.label}>
					<p>{m.label}</p>
				</div>
			))}
			<form onSubmit={HandleSubmit}>
				<div>
					<label htmlFor="email">
						<p>Email *</p>
					</label>
					<input
						id="email"
						name="email"
						type="text"
						value={email}
						onChange={HandleEmailChange}
					/>
					{formErrors.find(
						(f) => f.label === "email" && f.type === "incorrect-value",
					) && "Incorrect Email"}
				</div>
				<div>
					<label htmlFor="password">
						<p>Password *</p>
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autoComplete="off"
						value={password}
						onChange={HandlePasswordChange}
					/>
					{formErrors.find(
						(f) => f.label === "password" && f.type === "incorrect-value",
					) && "Incorrect Password"}
				</div>
				<button type="submit" disabled={formErrors.length > 0}>Send</button>
			</form>
		</div>
	);
}
