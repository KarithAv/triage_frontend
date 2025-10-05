import React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger"
  children: React.ReactNode
}

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const base =
    "px-4 py-2 rounded-lg font-bold transition focus:outline-none flex items-center gap-2"

  const variants = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-black",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
