export default async function Project() {
	const data = await getData();

	return (
		<div>
			<h1>{data.title}</h1>
		</div>
	);
}

const getData = async () => {
	const data = {
		title: "Projects",
		headline: "Projects Page",
		body: "Here you can find all my projects",
	};

	return data;
};

export const getConfig = async () => {
	return {
		render: "dynamic",
	} as const;
};
