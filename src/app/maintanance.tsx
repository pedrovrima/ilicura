import Image from "next/image";

export default function Maintanance() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Image src={"/ovo.png"} alt="wikimudas logo" width={300} height={100} />
      <p className="text-2xl font-bold text-[#F77316]">
        <span className="text-black">Wiki</span>Mudas está em manutenção
      </p>
      <p className="text-lg text-black">
        Qualquer dúvida favor contatar:{" "}
        <a href="mailto:contato@oama.eco.br">contato@oama.eco.br</a>
      </p>
    </div>
  );
}
