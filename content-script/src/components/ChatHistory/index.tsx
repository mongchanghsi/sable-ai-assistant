import { useRef, useEffect } from "react";
import usePrevious from "../../hooks/usePrevious";
import { Message } from "../../lib/types";
import ChatBubble from "../ChatBubble";
import "./style.css";

const ChatHistory = ({
  data,
  agentResponding,
}: {
  data: Message[];
  agentResponding: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevAgentResponding = usePrevious(agentResponding);
  const userInterruptedRef = useRef<boolean>(false);

  // useEffect(() => {
  //   const justStopped = prevAgentResponding && !agentResponding;
  //   if (justStopped) {
  //     containerRef.current?.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [agentResponding, prevAgentResponding]);

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth" });
  }, [data.length]);

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;
    let interval: ReturnType<typeof setInterval> | undefined;

    if (agentResponding) {
      interval = setInterval(() => {
        if (userInterruptedRef.current) return;
        el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }

    return () => {
      clearInterval(interval);
    };
  }, [agentResponding]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const isUserScrollingUp =
        el.scrollTop + el.clientHeight < el.scrollHeight - 20;

      userInterruptedRef.current = isUserScrollingUp;
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="history-container">
      {data.map((i) => (
        <ChatBubble key={i.id} data={i} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatHistory;
