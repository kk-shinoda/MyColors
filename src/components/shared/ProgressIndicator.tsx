import { List, Icon, ActionPanel, Action } from "@raycast/api";

interface ProgressIndicatorProps {
  message?: string;
  progress?: number; // 0-100
  showPercentage?: boolean;
}

/**
 * Progress indicator component for long-running operations
 * Provides visual feedback during async operations
 */
export default function ProgressIndicator({
  message = "Loading...",
  progress,
  showPercentage = false,
}: ProgressIndicatorProps) {
  const getProgressIcon = () => {
    if (progress === undefined) {
      return Icon.ArrowClockwise;
    }

    // Use different icons based on progress
    if (progress < 25) return Icon.Circle;
    if (progress < 50) return Icon.CircleProgress25;
    if (progress < 75) return Icon.CircleProgress50;
    if (progress < 100) return Icon.CircleProgress75;
    return Icon.CheckCircle;
  };

  const getProgressMessage = () => {
    if (progress === undefined) {
      return message;
    }

    const baseMessage = message || "Processing";
    const percentage = showPercentage ? ` (${Math.round(progress)}%)` : "";
    
    return `${baseMessage}${percentage}`;
  };

  return (
    <List.Item
      title={getProgressMessage()}
      icon={getProgressIcon()}
      accessories={
        progress !== undefined
          ? [{ text: `${Math.round(progress)}%` }]
          : undefined
      }
    />
  );
}

/**
 * Simple loading indicator for lists
 */
export function LoadingIndicator({ message = "Loading..." }: { message?: string }) {
  return (
    <List.Item
      title={message}
      icon={Icon.ArrowClockwise}
    />
  );
}

/**
 * Success indicator for completed operations
 */
export function SuccessIndicator({ message = "Operation completed" }: { message?: string }) {
  return (
    <List.Item
      title={message}
      icon={Icon.CheckCircle}
    />
  );
}

/**
 * Error indicator for failed operations
 */
export function ErrorIndicator({ 
  message = "Operation failed",
  onRetry,
}: { 
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <List.Item
      title={message}
      icon={Icon.ExclamationMark}
      actions={
        onRetry ? (
          <ActionPanel>
            <Action
              title="Retry"
              icon={Icon.ArrowClockwise}
              onAction={onRetry}
            />
          </ActionPanel>
        ) : undefined
      }
    />
  );
}