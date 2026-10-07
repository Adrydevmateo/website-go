import { Link } from "waku";
import Logger from "../../utils/logger";

export default async function ProjectsPage() {
	const data = await getData();
	return (
		<div>
			<h1>Projects</h1>
			{data.projects.map((project) => (
				<div key={project.id}>
					<Link to={{ to: "/projects/[project]", params: { project: "1" } }}>
						{project.title}
					</Link>
				</div>
			))}
		</div>
	);
}

async function getData() {
	const data = {
		projects: [],
	};
	try {
		const fetched = await fetch("https://jsonplaceholder.typicode.com/posts/");
		if (!fetched.ok) {
			if (fetched.status === 404) {
				throw new Error("Could not fetch projects, url not found");
			}
		}
		const parsed = await fetched.json();
		data.projects = parsed;
	} catch (error: unknown) {
		if (error instanceof Error) Logger.error(error.message);
	}
	return data;
}

export async function getConfig() {
	return {
		render: "dynamic",
	} as const;
}
