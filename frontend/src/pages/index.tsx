import SignInForm from "../components/signin-form";
// TODO: remove all console.logs from the frontend project
export default async function HomePage() {
	const data = await getData();

	return (
		<div>
			<SignInForm />
		</div>
	);
}

const getData = async () => {
	const data = {
		title: "Waku",
		headline: "Waku",
		body: "Hello world!",
	};

	return data;
};

export const getConfig = async () => {
	return {
		render: "static",
	} as const;
};
