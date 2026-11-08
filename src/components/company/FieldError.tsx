interface FieldErrorProps {
  message?: string;
}

const FieldError: React.FC<FieldErrorProps> = ({ message }) => {
  if (!message) {
    return null;
  }

  return <p className="mt-1.5 text-xs text-error-500">{message}</p>;
};

export default FieldError;
