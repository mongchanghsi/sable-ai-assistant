export type Message = {
  id: number;
  content: string;
  sender: "self" | "agent";
  createdDate: number;
};
