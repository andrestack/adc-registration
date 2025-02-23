import { Button } from "@/components/ui/button";
import { CircleArrowRight } from "lucide-react";
import { memo } from "react";

interface FloatingTotalProps {
  total: number;
  onContinue: () => void;
}

function FloatingTotal({ total, onContinue }: FloatingTotalProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center md:hidden z-50">
      <div className="text-lg font-bold">Total: €{total.toFixed(2)}</div>
      <Button onClick={onContinue} className="flex items-center gap-2">
        Continuar <CircleArrowRight size={16} />
      </Button>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(FloatingTotal);
