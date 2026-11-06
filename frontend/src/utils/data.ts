type TLocalStorageKey = "authenticated";

export function SetToLocalStorage(key: TLocalStorageKey, value: string) {
	localStorage.setItem(key, value);
}

export function GetFromLocalStorage(key: TLocalStorageKey): string | undefined {
	const found = localStorage.getItem(key);
	if (!found) return undefined;
	const parsed = JSON.parse(found);
	if (!parsed) return undefined;
	return found;
}