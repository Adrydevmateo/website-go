import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => {
	return (
		<>
			<div className="p-2 flex gap-2">
				<Link to="/" className="[&.active]:font-bold">
					Home
				</Link>{" "}
				<Link to="/auth" className="[&.active]:font-bold">
					Auth
				</Link>
			</div>
			<hr />
			<Outlet />
			<TanStackRouterDevtools />
		</>
	);
};

export const Route = createRootRoute({
	component: RootLayout,
	notFoundComponent: () => {
		return (
			<div>
				<p>This is the not found component</p>
				<Link to="/">Home</Link>
			</div>
		);
	},
});
