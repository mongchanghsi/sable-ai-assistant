import { ENCODE_SVG, SABLE_WORKING, SABLE_SNOOZING } from "../../assets";
import PulsingDot from "../Shared/PulsingDot";

const ChatProfile = ({
  status = "working",
}: {
  status?: "working" | "snoozing";
}) => {
  return (
    <div className="relative w-full flex items-center gap-2 py-2 px-4 border-b border-solid border-gray-200">
      <img
        className="w-8 h-8 rounded-full"
        src={ENCODE_SVG(status === "working" ? SABLE_WORKING : SABLE_SNOOZING)}
        alt="Sable Profile Icon"
      />
      <div className="flex flex-col">
        <p className="text-black font-semibold leading-normal m-0 p-0">
          Sable Assistant
        </p>
        <div className="flex items-center gap-2">
          <PulsingDot status={status === "working" ? "success" : "warning"} />
          <p className="text-gray-500 text-xs m-0 p-0">
            {status === "working" ? "Munching away..." : "zzz..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatProfile;
