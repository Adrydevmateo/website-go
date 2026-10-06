import Logger from "../../utils/logger";

export default async function Projects() {
	const data = await getData();
	Logger.debug('Debugger')
	Logger.error('Erroring')
	Logger.info('Information')
	Logger.warn('Warm')
	return (
		<div>
			<h1>Projects</h1>
		</div>
	)
}

async function getData() {
	const data = {
		projects: []
	};
	try {
		const fetched = await fetch('https://jsonplaceholder.typicode.com/posts/')
		if (!fetched.ok) {
			throw new Error('Exploded');
		}
		// console.log('AFTER EXPLODE')
		const parsed = await fetched.json()
		data.projects = parsed
	} catch (error) {
		// console.error(error)
	}
	return data;
}

export async function getConfig() {
	return {
		render: "dynamic",
	} as const;
}
