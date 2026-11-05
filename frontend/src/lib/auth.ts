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

	SetEmail: (email: string) => void;
	SetPassword: (password: string) => void;
	SetFormState: (formState: TFormState) => void;
	SetShowIncorrectEmail: (value: boolean) => void;
	SetShowIncorrectPassword: (value: boolean) => void;
	SetShowInvalidEmail: (value: boolean) => void;
	SetShowInvalidPassword: (value: boolean) => void;
	SetShowRequiredEmail: (value: boolean) => void;
	SetShowRequiredPassword: (value: boolean) => void;
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

	SetEmail: (email: string) => (AuthStore.email = email),
	SetPassword: (password: string) => (AuthStore.password = password),
	SetFormState: (formState: TFormState) => (AuthStore.formState = formState),
	SetShowIncorrectEmail: (value: boolean) =>
		(AuthStore.showIncorrectEmail = value),
	SetShowIncorrectPassword: (value: boolean) =>
		(AuthStore.showIncorrectPassword = value),
	SetShowInvalidEmail: (value: boolean) => (AuthStore.showInvalidEmail = value),
	SetShowInvalidPassword: (value: boolean) =>
		(AuthStore.showInvalidPassword = value),
	SetShowRequiredEmail: (value: boolean) =>
		(AuthStore.showRequiredEmail = value),
	SetShowRequiredPassword: (value: boolean) =>
		(AuthStore.showRequiredPassword = value),

	// posts: fetch(`https://jsonplaceholder.typicode.com/posts`)
	// 	.then((response) => response.json())
	// 	.then((json) => {
	// 		return json;
	// 	})
	// 	.catch((err) => console.error(err)),
});

export const UnsubscribeFromAuthStore = subscribe(AuthStore, () => {
	if (AuthStore.formState === "incomplete") {
		if (AuthStore.email.length >= 1) AuthStore.SetShowRequiredEmail(false);
		if (AuthStore.password.length >= 1)
			AuthStore.SetShowRequiredPassword(false);
		if (AuthStore.email && AuthStore.password)
			AuthStore.SetFormState("complete");
	}
	if (AuthStore.formState === "invalid") {
		if (IsEmailValid(AuthStore.email)) AuthStore.SetShowInvalidEmail(false);
		if (AuthStore.password.length >= 3) AuthStore.SetShowInvalidPassword(false);
		if (IsEmailValid(AuthStore.email) && AuthStore.password.length >= 3)
			AuthStore.SetFormState("valid");
	}
});

export default AuthStore;
