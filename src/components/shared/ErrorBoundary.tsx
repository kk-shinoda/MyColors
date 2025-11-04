import React, { Component, ReactNode } from "react";
import { List, Icon, ActionPanel, Action } from "@raycast/api";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Comprehensive error boundary component
 * Catches and handles React component errors gracefully
 * Requirements: 1.5, 2.3, 2.4, 3.4
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error boundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReportError = () => {
    const { error, errorInfo } = this.state;

    if (error) {
      // In a real app, this would send error reports to a service
      console.log("Error report:", {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo?.componentStack,
        timestamp: new Date().toISOString(),
      });
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <List>
          <List.EmptyView
            icon={Icon.ExclamationMark}
            title="Something went wrong"
            description={
              this.state.error?.message ||
              "An unexpected error occurred. Please try again."
            }
            actions={
              <ActionPanel>
                <Action
                  title="Try Again"
                  icon={Icon.ArrowClockwise}
                  onAction={this.handleRetry}
                />
                <Action
                  title="Report Error"
                  icon={Icon.Bug}
                  onAction={this.handleReportError}
                />
              </ActionPanel>
            }
          />
        </List>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">,
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
