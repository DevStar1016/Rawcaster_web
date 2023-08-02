import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { routerpaths } from "./Routes";
import { useDashboard } from "./Shared/Reduxfetcher";
import Spinner from "./Sharedcomponents/Spinner";
import InitialRenderComponent from "./Sharedcomponents/InitialRenderComponent";
import SocketComponent from "./Components/Socket/SocketComponent";
import { ThemeProvider } from "styled-components";
import {
  MeetingProvider,
  lightTheme,
} from "amazon-chime-sdk-component-library-react";
import withErrorBoundary from "./Sharedcomponents/withErrorBoundary";

function App() {
  const { isLoading } = useDashboard();
  const router = createBrowserRouter(routerpaths, { basename: "/" });
  return (
    <ThemeProvider theme={lightTheme}>
      <MeetingProvider>
        {isLoading ? <Spinner /> : null}
        <RouterProvider router={router} />
        <InitialRenderComponent />
        <SocketComponent />
      </MeetingProvider>
    </ThemeProvider>
  );
}

export default withErrorBoundary(App);
