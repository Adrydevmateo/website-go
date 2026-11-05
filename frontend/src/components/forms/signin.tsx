import { SignIn } from "@api/v1";
import store from "@lib/valtio";
import { IsEmailValid } from "@utils/form";
import { useEffect } from "react";
import { useSnapshot } from "valtio";

type TInputChangeEvent = React.ChangeEvent<HTMLInputElement, HTMLInputElement>;

export default function SignInForm() {
	const state = useSnapshot(store);

	const HandleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		state.setFormState("sending");

		if (!state.email || !state.password) {
			state.setFormState("incomplete");
			if (!state.email) state.setShowRequiredEmail(true);
			if (!state.password) state.setShowRequiredPassword(true);
			return;
		}

		if (!IsEmailValid(state.email) || state.password.length < 3) {
			state.setFormState("invalid");
			if (!IsEmailValid(state.email)) state.setShowInvalidEmail(true);
			if (state.password.length < 3) state.setShowInvalidPassword(true);
			return;
		}

		if (state.showIncorrectEmail) state.setShowIncorrectEmail(false);
		if (state.showIncorrectPassword) state.setShowIncorrectPassword(false);
		const { ok, data, error } = await SignIn(state.email, state.password);
		if (!ok && !data && !error) {
			console.log("Try again later");
			return;
		}
		if (error) {
			if (error.type === "incorrect-value") {
				state.setFormState("invalid");
				if (error.field === "email") state.setShowIncorrectEmail(true);
				if (error.field === "password") state.setShowIncorrectPassword(true);
			}
			return;
		}
		if (data) {
			state.setFormState("success");
			state.setEmail("");
			state.setPassword("");
			console.log("DATA FROM FETCHING: ", data);
			return;
		}
	};

	const HandleEmailChange = ({ target }: TInputChangeEvent) =>
		state.setEmail(target.value);

	const HandlePasswordChange = ({ target }: TInputChangeEvent) =>
		state.setPassword(target.value);

	useEffect(() => {
		if (state.formState === "incomplete") {
			if (state.email.length >= 1) state.setShowRequiredEmail(false);
			if (state.password.length >= 1) state.setShowRequiredPassword(false);
			if (state.email && state.password) state.setFormState("complete");
		}
		if (state.formState === "invalid") {
			if (IsEmailValid(state.email)) state.setShowInvalidEmail(false);
			if (state.password.length >= 3) state.setShowInvalidPassword(false);
			if (IsEmailValid(state.email) && state.password.length >= 3)
				state.setFormState("valid");
		}
	}, [
		state.formState,
		state.email,
		state.password,
		state.setFormState,
		state.setShowRequiredEmail,
		state.setShowRequiredPassword,
		state.setShowInvalidEmail,
		state.setShowInvalidPassword,
	]);

	return (
		<div>
			{state.formState === "incomplete" && <p>Incomplete</p>}
			{state.formState === "invalid" && <p>Invalid</p>}
			<form onSubmit={HandleSubmit}>
				<div>
					<label htmlFor="email">
						<p>Email *</p>
					</label>
					<input
						id="email"
						name="email"
						type="text"
						value={state.email}
						onChange={HandleEmailChange}
					/>
					{state.showIncorrectEmail && <p>Incorrect email</p>}
					{state.showRequiredEmail && <p>Email is required</p>}
					{state.showInvalidEmail && <p>Invalid email format</p>}
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
						value={state.password}
						onChange={HandlePasswordChange}
					/>
					{state.showIncorrectPassword && <p>Incorrect password</p>}
					{state.showRequiredPassword && <p>Password is required</p>}
					{state.showInvalidPassword && <p>Invalid password format</p>}
				</div>
				<button
					type="submit"
					disabled={
						state.formState === "incomplete" ||
						state.formState === "invalid" ||
						state.formState === "sending"
					}
				>
					Send
				</button>
			</form>
		</div>
	);
}
