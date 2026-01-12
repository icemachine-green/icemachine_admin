import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/index.js"; // store 경로가 맞는지 확인해주세요
import Router from "./routes/Router.jsx";
import swRegister from "./swRegister.js";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Router />
  </Provider>
);

// 서비스 워커 등록 처리
swRegister();
