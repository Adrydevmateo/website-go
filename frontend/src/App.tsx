import { useAtom, useAtomValue } from "jotai";
import "./App.css";
import NotifyComponent from "@components/notify";
import { NotificationsPollAtom } from "@lib/jotai/notification";
import AuthView from "./features/auth";

// TODO: Create notifications
function App() {
	const notifications = useAtomValue(NotificationsPollAtom);
	return (
		<>
			<AuthView />

			{notifications.map((notification) => (
				<NotifyComponent
					key={notification.title}
					title={notification.title}
					type={notification.type}
				/>
			))}
		</>
	);
}

export default App;
