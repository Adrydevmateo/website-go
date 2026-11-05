export type TErrorType = "required" | "incorrect-value";
export type TFormField = "email" | "password";
export type TFormState = "incomplete" | "complete" | "sending" | "idle"
export type TFormError = {
	field: TFormField;
	type: TErrorType;
};

export interface ISignInResponse {
	ok: boolean;
	data?: string;
	error?: TFormError;
}
