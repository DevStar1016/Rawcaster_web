/**
 * Entry point of the React application.
 * Renders the root component of the application and sets up the Redux store and persistence.
 * @returns None
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Toaster } from "react-hot-toast";
import { Provider as StoreProvider } from "react-redux";

import "./index.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "react-image-crop/dist/ReactCrop.css";
import "tui-image-editor/dist/tui-image-editor.css";
import { persistor, store } from "./Store/Redux/Config/Store";
import { PersistGate } from "redux-persist/integration/react";
import EventProvider from "./Sharedcomponents/EventProvider";
import { GOOGLE_CLIENT_ID } from "./Shared/Constant";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <StoreProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <EventProvider>
            <App />
            <Toaster />
          </EventProvider>
        </PersistGate>
      </StoreProvider>
    </GoogleOAuthProvider>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
