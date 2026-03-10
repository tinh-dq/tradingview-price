"use client";

import { Container } from "@/components/Container";
import { useMetalKoreaPrice } from "@/hooks/useMetalKoreaPrice";
import { cn } from "@/lib/utils";
import { ChevronUpIcon } from "lucide-react";

function Change({ value, as }: { value: number | null; as?: "percent" | undefined }) {
  if (value === null) return null;

  const color = value > 0 ? "text-red-500" : value < 0 ? "text-blue-500" : "";

  return (
    <span className={cn("flex", color)}>
      {value > 0 ? <ChevronUpIcon /> : <ChevronUpIcon className="rotate-180" />}
      {value.toFixed(2)}
      {as === "percent" && "%"}
    </span>
  );
}

export default function Page() {
  const { usdkrw, xau, xag, xpt, gold, silver, platinum } = useMetalKoreaPrice();

  return (
    <Container className="p-10 space-y-6">
      <h1 className="text-xl font-bold">Korea Metal Price</h1>

      <div className="flex gap-2">
        USDKRW: {usdkrw.price?.toLocaleString()}{" "}
        <Change value={usdkrw.changePercent} as="percent" /> <Change value={usdkrw.change} />
      </div>

      <div className="flex gap-2">
        Gold 금: {xau.price?.toLocaleString()} <Change value={xau.changePercent} as="percent" />
        <Change value={xau.change} />
      </div>

      <div className="flex gap-2">
        Silver 은: {xag.price?.toLocaleString()} <Change value={xag.changePercent} as="percent" />
        <Change value={xag.change} />
      </div>

      <div className="flex gap-2">
        Platinum 백금: {xpt.price?.toLocaleString()}{" "}
        <Change value={xpt.changePercent} as="percent" />
        <Change value={xpt.change} />
      </div>

      <hr />

      <h2 className="font-semibold">Gold</h2>
      <div>24K 1g: {gold.gram24?.toLocaleString()}</div>
      <div>24K 3.75g: {gold.don24?.toLocaleString()}</div>
      <div>18K 1g: {gold.gram18?.toLocaleString()}</div>
      <div>18K 3.75g: {gold.don18?.toLocaleString()}</div>
      <div>14K 1g: {gold.gram14?.toLocaleString()}</div>
      <div>14K 3.75g: {gold.don14?.toLocaleString()}</div>

      <hr />

      <h2 className="font-semibold">Silver</h2>
      <div>1g: {silver.gram?.toLocaleString()}</div>
      <div>3.75g: {silver.don?.toLocaleString()}</div>

      <hr />

      <h2 className="font-semibold">Platinum</h2>
      <div>1g: {platinum.gram?.toLocaleString()}</div>
      <div>3.75g: {platinum.don?.toLocaleString()}</div>
    </Container>
  );
}
