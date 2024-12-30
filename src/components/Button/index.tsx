import React from "react";

interface ButtonProps {
  type?: "primary" | "secondary" | "danger"; // Types for button styles
  onClick?: () => void; // Click handler
  children: React.ReactNode; // Button label/content
  className?: string; // Additional custom styles
  disabled?: boolean; // Disabled state
}

const Button: React.FC<ButtonProps> = ({
  type = "primary",
  onClick,
  children,
  className,
  disabled = false,
}) => {
  // Define button styles based on the type
  const baseStyle =
    "px-4 py-2 rounded shadow font-medium transition focus:outline-none";
  const styles: Record<string, string> = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${styles[type]} ${disabled ? "opacity-50" : ""} ${
        className || ""
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
