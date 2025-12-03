import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

// import { Toaster } from "react-hot-toast";
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={clientId}>
        <App />
        </GoogleOAuthProvider>
      </Provider>
  </StrictMode>
);
