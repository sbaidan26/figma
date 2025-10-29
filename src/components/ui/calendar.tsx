import * as React from "react"
import { cn } from "../../lib/utils"

export interface CalendarProps extends React.HTMLAttributes<HTMLDivElement> {}

function Calendar({ className, ...props }: CalendarProps) {
  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="text-sm">Calendar Component</div>
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
