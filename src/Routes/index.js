import { useNavigate, useRouteError } from "react-router";
import ModalLayout from "../Layouts/ModalLayout";
import { AuthRoute } from "./AuthRoutes";
import { DashboardRoute } from "./DashboardRoute";
import { EventRoute } from "./EventRoute";
import { ProfileRoute } from "./ProfileRoutes";
import ChimeSocketComponent from "../Components/Socket/ChimeSocketComponent";
import { Button, Result, Typography } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import Privacypolicy from "../Components/Policy/Privacypolicy";
import TermsandConditions from "../Components/Policy/TermsandConditions";
import Cookiespolicy from "../Components/Policy/CookiePolicy";

function ErrorBoundary() {
  let error = useRouteError();
  const { Paragraph, Text } = Typography;
  const navigate = useNavigate();
  // Uncaught ReferenceError: path is not defined

  const getSubTitle = () => {
    switch (error.status) {
      case 404:
        return "Sorry, the page you visited does not exist.";
      case 403:
        return "Sorry, you are not authorized to access this page.";
      case 500:
        return "Sorry, something went wrong.";
      default:
        return "There are some problems with your operation.";
    }
  };

  return (
    <Result
      status={error.status ? error.status : "error"}
      title={
        error.statusText
          ? error.statusText
          : "There are some problems with your operation."
      }
      subTitle={getSubTitle()}
      extra={[
        <Button
          key="buy"
          onClick={() => {
            navigate("/dashboard");
          }}
        >
          Back to Home
        </Button>,
      ]}
    >
      {error.data ? (
        <div className="desc">
          <Paragraph>
            <Text
              strong
              style={{
                fontSize: 16,
              }}
            >
              The content you submitted has the following error:
            </Text>
          </Paragraph>
          {/* {error?.error?.map((ele) => {
          return ( */}
          <Paragraph
            className="d-flex align-items-center"
            style={{
              color: "red",
            }}
          >
            <CloseCircleOutlined className="site-result-demo-error-icon mx-2" />
            {error.data}
          </Paragraph>
          {/* );
        })} */}
        </div>
      ) : null}
    </Result>
  );
}

export const routerpaths = [
  {
    path: "/",
    element: <ModalLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <ChimeSocketComponent />,
        children: [...AuthRoute, ...DashboardRoute, ...ProfileRoute],
      },
      {
        path: "/",
        element: <ChimeSocketComponent />,
        children: [...EventRoute],
      },
      {
        path: "/mobileprivacypolicy",
        element: <Privacypolicy />,
      },
      {
        path: "/mobiletermsandconditions",
        element: <TermsandConditions />,
      },
      {
        path: "/mobilecookiespolicy",
        element: <Cookiespolicy />,
      },
    ],
  },
];
