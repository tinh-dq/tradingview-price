export type SJCItem = {
  id: number;
  typeName: string;
  buyValue: number;
  sellValue: number;
};

export type SJCResponse = {
  latestDate: string;
  items: SJCItem[];
};

export async function getSJCPrices(): Promise<SJCResponse> {
  const res = await fetch("https://sjc.com.vn/GoldPrice/Services/PriceService.ashx", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      method: "GetCurrentGoldPricesByBranch",
      BranchId: "1",
    }),
    next: { revalidate: 60 }, // cache 1 minute
  });

  const json = await res.json();

  return {
    latestDate: json.latestDate,
    items: json.data.map((i: any) => ({
      id: i.Id,
      typeName: i.TypeName,
      buyValue: i.BuyValue,
      sellValue: i.SellValue,
    })),
  };
}

/**
 * format number with thousand comma
 */
export function formatVND(value: number) {
  return new Intl.NumberFormat("en-US").format(Math.round(value / 1000) * 1000);
}
