import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Result, Typography } from "antd";

/**
 * Wraps a component with an error boundary to catch and handle any errors that occur
 * during rendering.
 * @param {React.Component} WrappedComponent - The component to wrap with the error boundary.
 * @returns A new component that includes an error boundary.
 */
function withErrorBoundary(WrappedComponent) {
  const { Paragraph, Text } = Typography;
  return function ErrorBoundary(props) {
    try {
      return <WrappedComponent {...props} />;
    } catch (err) {
      return (
        <Result
          status="error"
          title="Submission Failed"
          subTitle="Please check and modify the following information before resubmitting."
          extra={[<Button key="buy">Back to Home</Button>]}
        >
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
            <Paragraph>
              <CloseCircleOutlined className="site-result-demo-error-icon" />{" "}
              Your account has been frozen. <a>Thaw immediately &gt;</a>
            </Paragraph>
            <Paragraph>
              <CloseCircleOutlined className="site-result-demo-error-icon" />{" "}
              Your account is not yet eligible to apply.{" "}
              <a>Apply Unlock &gt;</a>
            </Paragraph>
          </div>
        </Result>
      );
    }
  };
}

export default withErrorBoundary;
