import { createRoot } from "react-dom/client";
import App from "./App";
import { GrowthNarratives } from "./components/GrowthNarratives";
import "./index.css";

createRoot(document.getElementById("root")!).render(<><App /><GrowthNarratives /></>);
