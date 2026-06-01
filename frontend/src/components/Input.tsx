interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`
        w-full px-4 py-2.5 rounded-lg
        glass
        text-white placeholder-gray-400
        focus:border-accent focus:shadow-glow
        transition-all duration-300
        ${className}
      `}
      {...props}
    />
  )
}
