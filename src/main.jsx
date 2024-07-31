import ReactDOM from "react-dom/client";
import "./App.css";
import App from "./components/App";
import store from "./store/store";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
