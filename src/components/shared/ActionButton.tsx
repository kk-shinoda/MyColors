import { Action, Icon } from "@raycast/api";

interface ActionButtonProps {
  title: string;
  icon?: Icon;
  shortcut?: { modifiers: readonly string[]; key: string };
  style?: Action.Style | "Destructive";
  onAction: () => void | Promise<void>;
}

/**
 * Reusable action button component
 * Provides consistent action styling and behavior
 */
export default function ActionButton({
  title,
  icon,
  shortcut,
  style,
  onAction,
}: ActionButtonProps) {
  const actionStyle = style === "Destructive" ? Action.Style.Destructive : style;
  
  return (
    <Action
      title={title}
      icon={icon}
      shortcut={shortcut}
      style={actionStyle}
      onAction={onAction}
    />
  );
}