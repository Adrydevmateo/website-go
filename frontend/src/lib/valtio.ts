import { GetEnv } from "@utils/config";
import { proxy } from "valtio";

const store = proxy({
	posts: fetch(`${GetEnv("VITE_API_URL")}/posts`)
		.then((response) => response.json())
		.then((json) => {
			return json
		})
		.catch((err) => console.error(err)),
});

export default store;
