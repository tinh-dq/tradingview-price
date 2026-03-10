import { getPrices } from "@/lib/getPrices";
import { cn } from "@/lib/utils";
import { ChevronUpIcon } from "lucide-react";

function Change({ value, as }: { value: number | null; as?: "percent" | undefined }) {
  if (value === null) return null;

  const color = value > 0 ? "text-red-500" : value < 0 ? "text-blue-500" : "";

  return (
    <span className={cn("flex", color)}>
      {as === "percent" ? null : value > 0 ? (
        <ChevronUpIcon />
      ) : (
        <ChevronUpIcon className="rotate-180" />
      )}
      {value.toFixed(2)}
      {as === "percent" && "%"}
    </span>
  );
}
const fmt = (v: number) => `₩${v.toLocaleString()}`;

export default async function Page() {
  const prices = await getPrices();

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">한국 금 시세 (1돈 / 3.75g)</h1>

      <div className="space-y-3">
        <Price label="24K Gold" value={fmt(prices?.goldKrw)} />
        <Price label="18K Gold" value={fmt(prices?.gold18k)} />
        <Price label="14K Gold" value={fmt(prices?.gold14k)} />
        <Price label="Platinum" value={fmt(prices?.platKrw)} />
        <Price label="Silver" value={fmt(prices?.silverKrw)} />
      </div>

      <div className="mt-6 text-sm text-muted-foreground font-semibold">
        <div className="flex gap-2">
          <span>Gold: ${prices?.goldUsd}</span>
          <Change value={prices?.goldChange} as="percent" />
          <Change value={prices?.goldChangeAbs} />
        </div>
        <p className="mt-2">1 USD = {prices?.rate.toLocaleString()} KRW</p>
      </div>
    </div>
  );
}

function Price({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border rounded-lg p-3">
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
