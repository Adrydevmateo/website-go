import type { TFormState } from "@contracts/form";
import { IsEmailValid } from "@utils/form";
import { proxy, subscribe } from "valtio";

interface IAuthStore {
	email: string;
	password: string;
	formState: TFormState;
	showIncorrectEmail: boolean;
	showIncorrectPassword: boolean;
	showInvalidEmail: boolean;
	showInvalidPassword: boolean;
	showRequiredEmail: boolean;
	showRequiredPassword: boolean;

	setEmail: (email: string) => void;
	setPassword: (password: string) => void;
	setFormState: (formState: TFormState) => void;
	setShowIncorrectEmail: (value: boolean) => void;
	setShowIncorrectPassword: (value: boolean) => void;
	setShowInvalidEmail: (value: boolean) => void;
	setShowInvalidPassword: (value: boolean) => void;
	setShowRequiredEmail: (value: boolean) => void;
	setShowRequiredPassword: (value: boolean) => void;
}

const AuthStore: IAuthStore = proxy<IAuthStore>({
	email: "",
	password: "",
	formState: "idle",
	showIncorrectEmail: false,
	showIncorrectPassword: false,
	showInvalidEmail: false,
	showInvalidPassword: false,
	showRequiredEmail: false,
	showRequiredPassword: false,

	setEmail: (email: string) => (AuthStore.email = email),
	setPassword: (password: string) => (AuthStore.password = password),
	setFormState: (formState: TFormState) => (AuthStore.formState = formState),
	setShowIncorrectEmail: (value: boolean) =>
		(AuthStore.showIncorrectEmail = value),
	setShowIncorrectPassword: (value: boolean) =>
		(AuthStore.showIncorrectPassword = value),
	setShowInvalidEmail: (value: boolean) => (AuthStore.showInvalidEmail = value),
	setShowInvalidPassword: (value: boolean) =>
		(AuthStore.showInvalidPassword = value),
	setShowRequiredEmail: (value: boolean) =>
		(AuthStore.showRequiredEmail = value),
	setShowRequiredPassword: (value: boolean) =>
		(AuthStore.showRequiredPassword = value),

	// posts: fetch(`https://jsonplaceholder.typicode.com/posts`)
	// 	.then((response) => response.json())
	// 	.then((json) => {
	// 		return json;
	// 	})
	// 	.catch((err) => console.error(err)),
});

export const UnsubscribeFromAuthStore = subscribe(AuthStore, () => {
	console.log("state has changed to", AuthStore);
	if (AuthStore.formState === "incomplete") {
		if (AuthStore.email.length >= 1) AuthStore.setShowRequiredEmail(false);
		if (AuthStore.password.length >= 1)
			AuthStore.setShowRequiredPassword(false);
		if (AuthStore.email && AuthStore.password)
			AuthStore.setFormState("complete");
	}
	if (AuthStore.formState === "invalid") {
		if (IsEmailValid(AuthStore.email)) AuthStore.setShowInvalidEmail(false);
		if (AuthStore.password.length >= 3) AuthStore.setShowInvalidPassword(false);
		if (IsEmailValid(AuthStore.email) && AuthStore.password.length >= 3)
			AuthStore.setFormState("valid");
	}
});

export default AuthStore;
