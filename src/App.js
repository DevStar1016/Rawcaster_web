import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { routerpaths } from "./Routes";
import { useDashboard } from "./Shared/Reduxfetcher";
import Spinner from "./Sharedcomponents/Spinner";
import InitialRenderComponent from "./Sharedcomponents/InitialRenderComponent";
import { socketListen } from "./Services/SocketService";
import { useEffect } from "react";

function App() {
  const { isLoading } = useDashboard();
  const router = createBrowserRouter(routerpaths, { basename: "/" });

  useEffect(() => {
    socketListen.on("connect", () => {
      console.log("connected", socketListen.id);
    });
    socketListen.on("disconnect", (reason) => {
      console.log("connected", reason);
    });
    socketListen.on("error", (reason) => {
      console.log("error:", reason);
    });
    return () => {
      console.log("1234");
      socketListen.off("call");
    };
  }, []);

  return (
    <>
      {isLoading ? <Spinner /> : null}
      <RouterProvider router={router} />
      <InitialRenderComponent />
    </>
  );
}

export default App;
