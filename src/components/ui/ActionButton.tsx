import type { ReactNode } from "react";

interface ActionButtonProps {
  onClick: () => void;
  variant: "danger" | "success";
  icon: ReactNode;
  label: string;
}

const ActionButton = ({ onClick, variant, icon, label }: ActionButtonProps) => {
  const styles =
    variant === "danger"
      ? "bg-red-500 hover:bg-red-600"
      : "bg-green-500 hover:bg-green-600";

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-3 py-1.5 text-white text-xs font-medium rounded ${styles}`}
    >
      {icon}
      {label}
    </button>
  );
};

export default ActionButton;
