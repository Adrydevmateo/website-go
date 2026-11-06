import { createFileRoute, redirect } from "@tanstack/react-router";
import { GetFromLocalStorage } from "@utils/data";
// TODO: Add refresh jwt logic
export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	beforeLoad: async () => {
		const isAuthenticated = GetFromLocalStorage("authenticated");
		if (!isAuthenticated) {
			console.log("Not authenticated");
			throw redirect({ to: "/auth" });
		}
	},
});

function RouteComponent() {
	return <div>Hello "/dashboard"!</div>;
}
