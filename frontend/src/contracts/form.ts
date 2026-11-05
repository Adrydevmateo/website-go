export type TErrorType = "required" | "incorrect-value";
export type TFormField = "email" | "password";
export type TFormState = "incomplete" | "complete" | "invalid" | "valid" | "sending" | "idle" | "success"
export type TFormError = {
	field: TFormField;
	type: TErrorType;
};