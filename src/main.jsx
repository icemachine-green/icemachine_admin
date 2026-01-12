import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/index.js"; // store 경로가 맞는지 확인해주세요
import Router from "./routes/Router.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Router />
  </Provider>
);
