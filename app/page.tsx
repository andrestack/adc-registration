import RegistrationForm from "@/components/RegistrationForm";
import Image from "next/image";

export default function Home() {
  return (
    <main
      className="container mx-auto py-6 min-h-screen"
      style={{ background: "linear-gradient(to top, #c5d556, #ffffff)" }}
    >
      <div className="flex justify-start items-center mb-6">
        <Image
          src="/images/aldeia.jpg"
          alt="ADC Logo"
          width={100}
          height={100}
        />
        <h1 className="text-3xl font-bold mb-6">ADC 2025</h1>
      </div>

      <RegistrationForm />
    </main>
  );
}
