import { cn } from "../lib/utils";

export default function Badge({ children, className }) {
  return <span className={cn("badge", className)}>{children}</span>;
}
