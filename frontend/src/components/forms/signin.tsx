import { SignIn } from "@api/v1";
import AuthStore from "@lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { SetToLocalStorage } from "@utils/data";
import { IsEmailValid } from "@utils/form";
import { useSnapshot } from "valtio";

type TInputChangeEvent = React.ChangeEvent<HTMLInputElement, HTMLInputElement>;

export default function SignInForm() {
	const state = useSnapshot(AuthStore);
	const navigate = useNavigate({ from: "/auth" });

	const HandleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		state.SetFormState("sending");

		if (!state.email || !state.password) {
			state.SetFormState("incomplete");
			if (!state.email) state.SetShowRequiredEmail(true);
			if (!state.password) state.SetShowRequiredPassword(true);
			return;
		}

		if (!IsEmailValid(state.email) || state.password.length < 3) {
			state.SetFormState("invalid");
			if (!IsEmailValid(state.email)) state.SetShowInvalidEmail(true);
			if (state.password.length < 3) state.SetShowInvalidPassword(true);
			return;
		}

		if (state.showIncorrectEmail) state.SetShowIncorrectEmail(false);
		if (state.showIncorrectPassword) state.SetShowIncorrectPassword(false);
		const { ok, data, error } = await SignIn(state.email, state.password);
		if (!ok && !data && !error) {
			console.log("Try again later");
			return;
		}
		if (error) {
			if (error.type === "incorrect-value") {
				state.SetFormState("invalid");
				if (error.field === "email") state.SetShowIncorrectEmail(true);
				if (error.field === "password") state.SetShowIncorrectPassword(true);
			}
			return;
		}
		if (data) {
			state.SetFormState("success");
			state.SetEmail("");
			state.SetPassword("");
			console.log("DATA FROM FETCHING: ", data);
			SetToLocalStorage("authenticated", "true")
			navigate({ to: "/" });
			return;
		}
	};

	const HandleEmailChange = ({ target }: TInputChangeEvent) =>
		state.SetEmail(target.value);

	const HandlePasswordChange = ({ target }: TInputChangeEvent) =>
		state.SetPassword(target.value);

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
