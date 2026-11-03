import { useSnapshot } from "valtio";
import "./App.css";
import store from "@lib/valtio";
import { Suspense, use } from "react";

function Post({ title }: { title: string }) {
	return (
		<div>
			<p>{title}</p>
		</div>
	);
}

function Posts() {
	const snap = useSnapshot(store);
	const posts: Array<{
		userId: number;
		id: number;
		title: string;
		body: string;
	}> = use(snap.posts);
	return (
		<div>
			{posts.map((p) => (
				<Post key={p.id} title={p.title} />
			))}
		</div>
	);
}

// TODO: Create notifications
function App() {
	return (
		<Suspense fallback="Cargando........">
			<h1>Posts</h1>
			<Suspense fallback="Loading...">
				<Posts />
			</Suspense>
		</Suspense>
	);
}

export default App;
