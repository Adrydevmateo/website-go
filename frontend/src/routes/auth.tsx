import type {
	ISignInResponse,
	TErrorType,
	TFormError,
	TFormField,
	TFormState,
} from "@contracts/form";
import { createFileRoute } from "@tanstack/react-router";
import { GetEnv } from "@utils/config";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/auth")({
	component: RouteComponent,
});

function IsEmailValid(email: string) {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regex.test(email);
}

function RouteComponent() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [formErrors, setFormErrors] = useState<TFormError[]>([]);
	const [formState, setFormState] = useState<TFormState>("idle");

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
			if (error instanceof Error) {
				// TODO: use logger
				throw new Error(error.message);
			}
			return { ok: false };
		}
	}

	const IsFoundOnFormErrors = (value: TFormField, type: TErrorType) =>
		formErrors.find((f) => f.field === value && f.type === type);

	const HandleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFormState("sending");

		const tmp: typeof formErrors = formErrors;
		if (!email)
			if (!IsFoundOnFormErrors("email", "required"))
				tmp.push({ field: "email", type: "required" });
		if (!password)
			if (!IsFoundOnFormErrors("password", "required"))
				tmp.push({ field: "password", type: "required" });

		if (tmp.length > 0) return setFormState("incomplete");
		setFormErrors(tmp);

		const { data, error } = await SignIn(email, password);
		if (error) {
			setFormState("incomplete");
			if (!IsFoundOnFormErrors(error.field, error.type))
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
			if (IsEmailValid(target.value))
				setFormErrors(() => formErrors.filter((f) => f.field !== "email"));
	};

	const HandlePasswordChange = ({
		target,
	}: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
		const currentValue = target.value;
		setPassword(currentValue);
		if (formState === "incomplete")
			if (currentValue.length >= 3)
				setFormErrors(() => formErrors.filter((f) => f.field !== "password"));
	};

	useEffect(() => {
		if (formErrors.length < 1) setFormState("complete");
	}, [formErrors]);

	return (
		<div>
			{formState === "incomplete" && <p>Incomplete</p>}
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
					{IsFoundOnFormErrors("email", "incorrect-value") && "Incorrect email"}
					{IsFoundOnFormErrors("email", "required") && "Email is required"}
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
					{IsFoundOnFormErrors("password", "incorrect-value") &&
						"Incorrect Password"}
					{IsFoundOnFormErrors("password", "required") &&
						"Password is required"}
				</div>
				<button type="submit" disabled={formErrors.length > 0}>
					Send
				</button>
			</form>
		</div>
	);
}
