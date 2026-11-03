import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/auth")({
	component: RouteComponent,
});

function RouteComponent() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [formErrors, setFormErrors] = useState<string[]>([]);
	const [formState, setFormState] = useState<
		"incomplete" | "complete" | "sending" | "idle"
	>("idle");

	const HandleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setFormState("sending");
		if (email.length < 1 || password.length < 1) {
			setFormState("incomplete");
			const tmpFormErrorsList = new Set([...formErrors]);
			if (email.length < 1) tmpFormErrorsList.add("email");
			if (password.length < 1) tmpFormErrorsList.add("password");
			setFormErrors([...tmpFormErrorsList]);
			return;
		}

		console.log("Sending data...");
	};

	const HandleEmailChange = ({
		target,
	}: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
		const currentValue = target.value;
		setEmail(currentValue);
		if (formState === "incomplete")
			if (currentValue.includes("@"))
				setFormErrors(() => formErrors.filter((f) => f !== "email"));
	};

	const HandlePasswordChange = ({
		target,
	}: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
		const currentValue = target.value;
		setPassword(currentValue);
		if (formState === "incomplete")
			if (currentValue.length > 3)
				setFormErrors(() => formErrors.filter((f) => f !== "password"));
	};

	useEffect(() => {
		if (formErrors.length < 1) setFormState("complete");
	}, [formErrors]);

	return (
		<div>
			{formState === "incomplete" && <p>Incomplete</p>}
			{formErrors.map((m) => (
				<div key={m}>
					<p>{m}</p>
				</div>
			))}
			<form onSubmit={HandleSubmit}>
				<div>
					<label htmlFor="email">
						<p>Email {formErrors.find((f) => f === "email") && "*"}</p>
					</label>
					<input
						id="email"
						name="email"
						type="text"
						value={email}
						onChange={HandleEmailChange}
					/>
				</div>
				<div>
					<label htmlFor="password">
						<p>Password {formErrors.find((f) => f === "password") && "*"}</p>
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autoComplete="off"
						value={password}
						onChange={HandlePasswordChange}
					/>
				</div>
				<button type="submit">Send</button>
			</form>
		</div>
	);
}
