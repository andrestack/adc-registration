import RegistrationForm from "@/components/RegistrationForm";
import Image from "next/image";

export default function Home() {
  return (
    <main
      className="container mx-auto py-6 min-h-screen"
      style={{ background: "linear-gradient(to top, #c5d556, #ffffff)" }}
    >
      <div className="flex justify-start place-items-center">
        <Image
          src="/images/ADC_logo_no_bg.png"
          alt="ADC Logo"
          width={100}
          height={100}
        />
        <span className="text-8xl font-bold font-garda-empty ml-4">2025</span>
      </div>

      <RegistrationForm />
    </main>
  );
}
