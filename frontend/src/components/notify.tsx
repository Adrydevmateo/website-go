import type { INotification } from "@lib/jotai/notification";
import { useEffect, useState } from "react";

interface IProps extends INotification {}

export default function NotifyComponent(prop: IProps) {
	const [visible, setVisible] = useState(true);
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setVisible(false)
		}, 3000);
		return () => {
			clearTimeout(timeoutId);
		};
	}, []);
	if(!visible) return
	return (
		<div id={prop.title}>
			<h1>{prop.title}</h1>
		</div>
	);
}
