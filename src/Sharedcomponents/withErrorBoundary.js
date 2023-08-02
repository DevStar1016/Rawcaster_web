import React, { useState } from "react";

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
