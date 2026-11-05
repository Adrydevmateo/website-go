import { SignIn } from "@api/v1";
import type { TFormState } from "@contracts/form";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type TInputChangeEvent = React.ChangeEvent<HTMLInputElement, HTMLInputElement>;

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
	const [formState, setFormState] = useState<TFormState>("idle");
	const [showIncorrectEmail, setShowIncorrectEmail] = useState(false);
	const [showIncorrectPassword, setShowIncorrectPassword] = useState(false);
	const [showInvalidEmail, setShowInvalidEmail] = useState(false);
	const [showInvalidPassword, setShowInvalidPassword] = useState(false);
	const [showRequiredEmail, setShowRequiredEmail] = useState(false);
	const [showRequiredPassword, setShowRequiredPassword] = useState(false);

	const HandleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFormState("sending");

		if (!email || !password) {
			setFormState("incomplete");
			if (!email) setShowRequiredEmail(true);
			if (!password) setShowRequiredPassword(true);
			return;
		}

		if (!IsEmailValid(email) || password.length < 3) {
			setFormState("invalid");
			if (!IsEmailValid(email)) setShowInvalidEmail(true);
			if (password.length < 3) setShowInvalidPassword(true);
			return;
		}

		if (showIncorrectEmail) setShowIncorrectEmail(false);
		if (showIncorrectPassword) setShowIncorrectPassword(false);
		const { ok, data, error } = await SignIn(email, password);
		if (!ok && !data && !error) {
			console.log("Try again later");
			return;
		}
		if (error) {
			if (error.type === "incorrect-value") {
				setFormState("invalid");
				if (error.field === "email") setShowIncorrectEmail(true);
				if (error.field === "password") setShowIncorrectPassword(true);
			}
			return;
		}
		if (data) {
			setFormState("success");
			setEmail("");
			setPassword("");
			console.log("DATA FROM FETCHING: ", data);
			return;
		}
	};

	const HandleEmailChange = ({ target }: TInputChangeEvent) =>
		setEmail(target.value);

	const HandlePasswordChange = ({ target }: TInputChangeEvent) =>
		setPassword(target.value);

	useEffect(() => {
		if (formState === "incomplete") {
			if (email.length >= 1) setShowRequiredEmail(false);
			if (password.length >= 1) setShowRequiredPassword(false);
			if (email && password) setFormState("complete");
		}
		if (formState === "invalid") {
			if (IsEmailValid(email)) setShowInvalidEmail(false);
			if (password.length >= 3) setShowInvalidPassword(false);
			if (IsEmailValid(email) && password.length >= 3) setFormState("valid");
		}
	}, [formState, email, password]);

	return (
		<div>
			{formState === "incomplete" && <p>Incomplete</p>}
			{formState === "invalid" && <p>Invalid</p>}
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
					{showIncorrectEmail && <p>Incorrect email</p>}
					{showRequiredEmail && <p>Email is required</p>}
					{showInvalidEmail && <p>Invalid email format</p>}
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
					{showIncorrectPassword && <p>Incorrect password</p>}
					{showRequiredPassword && <p>Password is required</p>}
					{showInvalidPassword && <p>Invalid password format</p>}
				</div>
				<button
					type="submit"
					disabled={
						formState === "incomplete" ||
						formState === "invalid" ||
						formState === "sending"
					}
				>
					Send
				</button>
			</form>
		</div>
	);
}
