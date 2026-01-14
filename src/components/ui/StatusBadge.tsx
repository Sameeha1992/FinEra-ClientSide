interface StatusBadgeProps {
  status: "active" | "blocked";
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles =
    status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}>
      {status === "active" ? "Active" : "Blocked"}
    </span>
  );
};

export default StatusBadge;
