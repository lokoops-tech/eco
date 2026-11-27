import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./PasswordInput.css";
export default function PasswordInput({ disabled, autoComplete = "new-password", ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="admin-password-field">
      <input {...props} type={visible ? "text" : "password"} disabled={disabled} autoComplete={autoComplete} aria-label={props["aria-label"] || props.placeholder || "New password"} />
      <button type="button" className="admin-password-toggle" disabled={disabled}
        aria-label={visible ? "Hide password" : "Show password"}
        title={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible(value => !value)}>
        {visible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
      </button>
    </div>
  );
}
