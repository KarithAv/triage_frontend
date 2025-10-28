import React from "react"

// 1. Definición de la Interfaz de Propiedades
interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  value: string
 onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DateInput({label, value, onChange, id,className = "", ...props }: DateInputProps) {
  const containerBase = "flex flex-col"
  const inputBase =
    "font-light w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
  return (
    <div className={`${containerBase}`}>    
      <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        onChange={onChange}
        className={`${inputBase} ${className}`}
        {...props} 
      />
    </div>
  )
}