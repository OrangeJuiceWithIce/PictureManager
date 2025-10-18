import React from "react";
import "./button.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost" | "danger" | "success";
};

const Button: React.FC<ButtonProps> = ({ variant = "primary", className = "", ...props }) => {
    return <button {...props} className={`ui-btn ui-btn--${variant} ${className}`.trim()} />;
};

export default Button;