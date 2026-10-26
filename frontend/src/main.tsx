import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Store } from "@lib/jotai/store.ts";
import { Provider } from "jotai";
import App from "./App.tsx";

const root = document.getElementById("root");
if (!root) throw new Error("root not found");
createRoot(root).render(
	<StrictMode>
		<Provider store={Store}>
			<App />
		</Provider>
	</StrictMode>,
);
