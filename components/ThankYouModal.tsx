import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThankYouModal({ isOpen, onClose }: ThankYouModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex flex-col gap-2 items-center justify-center">
            <Image src="/images/aldeia.jpg" alt="Logo" width={70} height={70} />
            <DialogTitle className="text-2xl font-bold font-garda-empty">
              Obrigado!
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4 pt-3 text-black text-center">
          <div>Sua inscrição foi submetida com sucesso.</div>
          <div>
            Por favor envie uma cópia do seu recibo de transferência bancária
            para o nosso email
          </div>
          <div className="flex justify-center">
            <Link
              href="mailto:contact@aldeia-djembe-camp.com?subject=Comprovativo%20de%20Pagamento"
              className="text-lg border-2 border-adc-green bg-adc-green rounded-md px-2 py-1 hover:bg-white"
            >
              Enviar
            </Link>
          </div>
          <div>
            Confirmaremos a sua inscrição assim que recebermos a confirmação do
            pagamento.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
