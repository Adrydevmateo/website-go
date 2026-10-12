import { Link } from "waku";
import FetchUtil from "../../utils/fetch";
import type { IProject } from "./model";

export default async function ProjectsPage() {
	const { projects } = await getData();
	if (!projects.ok) {
		return (
			<div>
				<h1>Sorry we couldn't retrieve the projects</h1>
				<p>Try again in a couple minutes</p>
			</div>
		);
	}
	if (!projects.data || projects.data.length === 0) {
		return (
			<div>
				<h1>Sorry, we currently don't have available projects</h1>
			</div>
		);
	}
	return (
		<div>
			<h1>Projects</h1>
			{projects.data.map((project) => (
				<div key={project.id}>
					<Link to={{ to: "/projects/[project]", params: { project: "1" } }}>
						{project.title}
					</Link>
				</div>
			))}
		</div>
	);
}

interface IData {
	projects: Awaited<ReturnType<typeof FetchUtil<Array<IProject>>>>;
}

// TODO: fetch projects from backend
async function getData() {
	const pageData: IData = {
		projects: await FetchUtil<Array<IProject>>("/posts/"),
	};
	return pageData;
}

export async function getConfig() {
	return {
		render: "dynamic",
	} as const;
}
