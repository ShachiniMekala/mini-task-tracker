import "./Button.css";


export type ButtonProps = {
  onClick?: () => void;
  children?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  type?: "button" | "submit";
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  [key: string]: any;
};

const Button = ({
  onClick,
  children,
  loading = false,
  loadingText,
  type = "button",
  className = "",
  icon,
  disabled = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`btn ${className} ${loading ? "btn-loading" : ""}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="loading-spinner-small"></span>
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {icon}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
