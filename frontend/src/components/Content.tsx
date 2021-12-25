import { FC } from "react";
import { Task } from "../interfaces";
interface ContentProps {
  selectedTask: Task | null;
}
const Content: FC<ContentProps> = () => {
  return <div></div>;
};

export default Content;
