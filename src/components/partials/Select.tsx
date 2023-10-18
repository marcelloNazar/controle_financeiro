interface SelectProps {
  register?: any;
  options: { value: string; label: string }[];
  error?: string;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  register,
  options,
  error,
  placeholder,
  ...props
}) => {
  return (
    <div className="w-full">
      <select className="input" {...register} {...props}>
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
