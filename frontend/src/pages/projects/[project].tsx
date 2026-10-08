import type { PageProps } from "waku/router";
import Logger from "../../utils/logger";
import FetchUtil from "../../utils/fetch";

interface IProject {
  "userId": number,
  "id": number,
  "title": string,
  "body": string
}

export default async function ProjectPage({project}: PageProps<'/projects/[project]'>) {
	const {data, ok} = await getData(project);
	if(!ok) {
		return (
			<div>
				<h1>Sorry we couldn't retrieve the project</h1>
				<p>Try again in a couple minutes</p>
			</div>
		)
	}
	return (
		<div>
			<h1>{data?.title}</h1>
			<p>{data?.body}</p>
			<p>{project}</p>
		</div>
	);
}

const getData = async (projectId: string) => {
	return await FetchUtil<IProject>(`/posts/${projectId}`);
};

export const getConfig = async () => {
	return {
		render: "dynamic",
	} as const;
};
