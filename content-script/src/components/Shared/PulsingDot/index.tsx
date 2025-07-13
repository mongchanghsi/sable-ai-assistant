import { memo } from "react";
import "./style.css";

type Status = "success" | "warning" | "info" | "error";

const GetColor = (status: Status) => {
  switch (status) {
    case "success":
      return "pulsing-success";
    case "warning":
      return "pulsing-warning";
    case "info":
      return "pulsing-info";
    case "error":
      return "pulsing-error";
  }
};

const PulsingDot = ({ status = "success" }: { status?: Status }) => {
  return (
    <span className="pulsing-wrapper">
      <span className={`pulsing-circle ping ${GetColor(status)}`} />
      <span className={`pulsing-circle ${GetColor(status)}`} />
    </span>
  );
};

export default memo(PulsingDot);
