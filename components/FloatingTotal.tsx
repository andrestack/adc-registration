import { Button } from '@/components/ui/button'
import { CircleArrowRight } from "lucide-react";

interface FloatingTotalProps {
  total: number
  onContinue: () => void
}

export default function FloatingTotal({ total, onContinue }: FloatingTotalProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center md:hidden">
      <div className="text-lg font-bold">Total: €{total}</div>
      <Button onClick={onContinue} className="flex items-center gap-2">
        Continuar <CircleArrowRight size={16} />
      </Button>
    </div>
  )
}

