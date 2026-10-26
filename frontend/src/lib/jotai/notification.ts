import { atom } from "jotai";
import { Store } from "./store";

export interface INotification {
	title: string;
	type: "info" | "error" | "success" | "warning";
}

export const NotificationsPollAtom = atom<Array<INotification>>([]);

export function AddNotification(notification: INotification) {
	const notifications = Store.get(NotificationsPollAtom);
	const filtered = notifications.filter((f) => f.title !== notification.title);
	filtered.push(notification);
	Store.set(NotificationsPollAtom, filtered);
}
