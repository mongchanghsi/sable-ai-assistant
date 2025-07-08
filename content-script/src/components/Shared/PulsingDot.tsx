import { memo } from "react";

type Status = "success" | "warning" | "info" | "error";

const GetColor = (status: Status) => {
  switch (status) {
    case "success":
      return "bg-green-300";
    case "warning":
      return "bg-yellow-300";
    case "info":
      return "bg-purple-300";
    case "error":
      return "bg-red-300";
  }
};

const PulsingDot = ({ status = "success" }: { status?: Status }) => {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${GetColor(status)}`}
      ></span>
      <span
        className={`relative inline-flex rounded-full h-2 w-2 ${GetColor(status)}`}
      ></span>
    </span>
  );
};

export default memo(PulsingDot);
