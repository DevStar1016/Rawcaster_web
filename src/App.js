/**
 * The main component of the application.
 * @returns The rendered application component.
 */
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { routerpaths } from "./Routes";
import { useDashboard } from "./Shared/Reduxfetcher";
import Spinner from "./Sharedcomponents/Spinner";
import InitialRenderComponent from "./Sharedcomponents/InitialRenderComponent";
import { ThemeProvider } from "styled-components";
import {
  MeetingProvider,
  lightTheme,
} from "amazon-chime-sdk-component-library-react";
import withErrorBoundary from "./Sharedcomponents/withErrorBoundary";

function App() {
  const { isLoading } = useDashboard();
  const router = createBrowserRouter(routerpaths, { basename: "/" });
  console.log(process.env.REACT_APP_API_URL, process.env.REACT_APP_SALT_KEY);
  return (
    <ThemeProvider theme={lightTheme}>
      <MeetingProvider>
        {isLoading ? <Spinner /> : null}
        <RouterProvider router={router} />
        <InitialRenderComponent />
      </MeetingProvider>
    </ThemeProvider>
  );
}

export default withErrorBoundary(App);
