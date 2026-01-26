import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
    label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, id, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-900">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    id={id}
                    className={cn(
                        "flex h-14 w-full rounded-xl border border-input bg-background px-4 py-3 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm",
                        "focus:border-primary focus:shadow-lg focus:shadow-primary/10", // Active state enhancement
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
