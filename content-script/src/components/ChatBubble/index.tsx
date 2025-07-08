import { useEffect, useState } from "react";
import clsx from "clsx";
import { Message } from "../../lib/types";
import { TYPING_DURATION_PER_LETTER } from "../../lib/constants";

// const ChatBubble = ({ data }: { data: Message }) => {
//   return (
//     <div
//       className={clsx(
//         "flex items-end",
//         data.sender === "self" ? "justify-end" : "justify-start"
//       )}
//     >
//       <div
//         className={clsx(
//           "max-w-[75%] rounded-lg py-2 px-3 text-sm shadow",
//           data.sender === "self"
//             ? "bg-blue-500 text-white rounded-br-none"
//             : "bg-gray-200 text-gray-800 rounded-bl-none"
//         )}
//       >
//         {data.content}
//       </div>
//     </div>
//   );
// };

// const ChatBubble = ({ data }: { data: Message }) => {
//   const isSelf = data.sender === "self";

//   return (
//     <div
//       className={clsx(
//         "flex items-end px-3",
//         isSelf ? "justify-end" : "justify-start"
//       )}
//     >
//       <div className="relative max-w-[75%]">
//         <div
//           className={clsx(
//             "relative rounded-lg py-2 px-3 text-sm shadow",
//             isSelf
//               ? "bg-blue-500 text-white rounded-br-none"
//               : "bg-gray-200 text-gray-800 rounded-bl-none"
//           )}
//         >
//           {data.content}
//           <div
//             className={clsx(
//               "absolute w-2 h-2 rotate-45",
//               isSelf
//                 ? "bg-blue-500 bottom-[2px] -right-1"
//                 : "bg-gray-200 bottom-[2px] -left-1"
//             )}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

const ChatBubble = ({ data }: { data: Message }) => {
  const isSelf = data.sender === "self";
  const shouldAnimate = !isSelf;
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!shouldAnimate) {
      setDisplayedText(data.content);
      return;
    }

    if (!data.content) return;

    const message = data.content;
    let index = 0;
    let interval: NodeJS.Timeout;

    const startTyping = () => {
      interval = setInterval(() => {
        setDisplayedText((prev) => {
          if (index >= message.length) {
            clearInterval(interval);
            return prev;
          }

          const next = prev + message[index];
          index++;
          return next;
        });
      }, TYPING_DURATION_PER_LETTER);
    };

    setDisplayedText("");
    startTyping();

    return () => clearInterval(interval);
  }, [data.content, shouldAnimate]);

  return (
    <div
      className={clsx(
        "flex items-end px-3",
        isSelf ? "justify-end" : "justify-start"
      )}
    >
      <div className="relative max-w-[75%]">
        <div
          className={clsx(
            "relative rounded-lg py-2 px-3 text-sm shadow whitespace-pre-line break-words",
            isSelf
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-gray-200 text-gray-800 rounded-bl-none"
          )}
        >
          {displayedText}
          <div
            className={clsx(
              "absolute w-2 h-2 rotate-45",
              isSelf
                ? "bg-blue-500 bottom-[2px] -right-1"
                : "bg-gray-200 bottom-[2px] -left-1"
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
