import Image from "next/image";
import { assets } from "@/lib/constants";

type ChitterGuideProps = {
  message: string;
};

export function PeerPlaybookGuide({ message }: ChitterGuideProps) {
  return (
    <div className="relative flex h-full flex-col items-center justify-end">
      <div className="bg-surface text-background relative z-50 inline-flex w-fit max-w-xs rounded-xl px-3 py-2 shadow-[0_2px_6px_0px_rgba(30,30,30,0.1)]">
        <p className="font-body text-foreground text-lg leading-snug">
          {message}
        </p>
        <div className="bg-surface fill-surface absolute -bottom-2 left-1/2 z-0 size-4 -translate-x-1/2 rotate-45 rounded-[2px] shadow-[4px_4px_5px_rgba(30,30,30,0.1)] data-[side=left]:translate-x-[-1.5px] data-[side=right]:translate-x-[1.5px]" />
      </div>

      <Image
        src={assets.logo}
        alt="Chitter, your Chatterbrain guide"
        width={400}
        height={400}
        priority
        className="h-auto w-full max-w-60"
      />
    </div>
  );
}
