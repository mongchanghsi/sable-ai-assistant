import { ENCODE_SVG, SABLE_WORKING, SABLE_SNOOZING } from "../../assets";
import PulsingDot from "../Shared/PulsingDot";
import "./style.css";

const ChatProfile = ({
  status = "working",
}: {
  status?: "working" | "snoozing";
}) => {
  return (
    <div className="chat-profile">
      <img
        className="chat-profile-avatar"
        src={ENCODE_SVG(status === "working" ? SABLE_WORKING : SABLE_SNOOZING)}
        alt="Sable Profile Icon"
      />
      <div className="chat-profile-info">
        <p className="chat-profile-name">Sable Assistant</p>
        <div className="chat-profile-status">
          <PulsingDot status={status === "working" ? "success" : "warning"} />
          <p className="chat-profile-message">
            {status === "working" ? "Munching away..." : "zzz..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatProfile;
