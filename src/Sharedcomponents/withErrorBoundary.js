/**
 * Wraps a component with an error boundary to catch and handle any errors that occur
 * during rendering.
 * @param {React.Component} WrappedComponent - The component to wrap with the error boundary.
 * @returns A new component that includes an error boundary.
 */
function withErrorBoundary(WrappedComponent) {
  return function ErrorBoundary(props) {
    try {
      return <WrappedComponent {...props} />;
    } catch (err) {
      return <div>An error occurred: {err.toString()}</div>;
    }
  };
}

export default withErrorBoundary;
