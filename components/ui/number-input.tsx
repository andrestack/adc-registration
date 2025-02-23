import { Input } from "./input";
import { Button } from "./button";
import { Minus, Plus } from "lucide-react";
import { forwardRef } from "react";

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    { onValueChange, min = 0, max = 100, step = 1, value, ...props },
    ref
  ) => {
    const handleIncrement = () => {
      const currentValue = Number(value || 0);
      if (max !== undefined && currentValue >= max) return;
      onValueChange?.(currentValue + step);
    };

    const handleDecrement = () => {
      const currentValue = Number(value || 0);
      if (min !== undefined && currentValue <= min) return;
      onValueChange?.(currentValue - step);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      if (isNaN(newValue)) return;
      if (min !== undefined && newValue < min) return;
      if (max !== undefined && newValue > max) return;
      onValueChange?.(newValue);
    };

    return (
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleDecrement}
          disabled={value === min}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          ref={ref}
          className="w-20 text-center"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          {...props}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleIncrement}
          disabled={value === max}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";

export { NumberInput };
