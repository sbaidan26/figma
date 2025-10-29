import * as React from "react"
import { cn } from "../../lib/utils"

const Tabs = ({ children, value, onValueChange, ...props }: { children: React.ReactNode; value: string; onValueChange: (value: string) => void } & React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, { value, onValueChange })
      }
      return child
    })}
  </div>
)

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
)
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string; activeValue?: string; onValueChange?: (value: string) => void }>(
  ({ className, value, activeValue, onValueChange, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        activeValue === value ? "bg-background text-foreground shadow-sm" : "",
        className
      )}
      onClick={() => onValueChange?.(value)}
      {...props}
    />
  )
)
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = ({ children, value, activeValue, ...props }: { children: React.ReactNode; value: string; activeValue?: string } & React.HTMLAttributes<HTMLDivElement>) => {
  if (value !== activeValue) return null
  return <div {...props}>{children}</div>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
