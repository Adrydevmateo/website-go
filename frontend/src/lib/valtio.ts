import type { TFormState } from "@contracts/form";
import { GetEnv } from "@utils/config";
import { proxy } from "valtio";

interface IStoreProxy {
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

const store: IStoreProxy = proxy<IStoreProxy>({
	email: "",
	password: "",
	formState: "idle",
	showIncorrectEmail: false,
	showIncorrectPassword: false,
	showInvalidEmail: false,
	showInvalidPassword: false,
	showRequiredEmail: false,
	showRequiredPassword: false,

	setEmail: (email: string) => (store.email = email),
	setPassword: (password: string) => (store.password = password),
	setFormState: (formState: TFormState) => (store.formState = formState),
	setShowIncorrectEmail: (value: boolean) => (store.showIncorrectEmail = value),
	setShowIncorrectPassword: (value: boolean) =>
		(store.showIncorrectPassword = value),
	setShowInvalidEmail: (value: boolean) => (store.showInvalidEmail = value),
	setShowInvalidPassword: (value: boolean) =>
		(store.showInvalidPassword = value),
	setShowRequiredEmail: (value: boolean) => (store.showRequiredEmail = value),
	setShowRequiredPassword: (value: boolean) =>
		(store.showRequiredPassword = value),

	// posts: fetch(`https://jsonplaceholder.typicode.com/posts`)
	// 	.then((response) => response.json())
	// 	.then((json) => {
	// 		return json;
	// 	})
	// 	.catch((err) => console.error(err)),
});

export default store;
