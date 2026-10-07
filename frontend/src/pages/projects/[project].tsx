import type { PageProps } from "waku/router";
import Logger from "../../utils/logger";

export default async function ProjectPage({project}: PageProps<'/projects/[project]'>) {
	const data = await getData(project);

	return (
		<div>
			<h1>{data.data.title}</h1>
			<p>{project}</p>
		</div>
	);
}

const getData = async (projectId: string) => {
	const project = {};

	try {
		const fetched = await fetch(`https://jsonplaceholder.typicode.com/posts/${projectId}`);
		if (!fetched.ok) {
			if (fetched.status === 404) {
				throw new Error("Could not fetch projects, url not found");
			}
		}
		const parsed = await fetched.json();
		project.data = parsed;
	} catch (error: unknown) {
		if (error instanceof Error) Logger.error(error.message);
	}

	return project;
};

export const getConfig = async () => {
	return {
		render: "dynamic",
	} as const;
};
