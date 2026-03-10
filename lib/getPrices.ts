export type Prices = {
  goldKrw: number;
  gold18k: number;
  gold14k: number;
  platKrw: number;
  silverKrw: number;
  goldUsd: number;
  goldChangeAbs: number;
  goldChange: number;
  goldBid: number;
  goldAsk: number;
  rate: number;
  silverUsd: number;
  silverChangeAbs: number;
  silverChange: number;
  silverBid: number;
  silverAsk: number;
  platUsd: number;
  platChangeAbs: number;
  platChange: number;
  platBid: number;
  platAsk: number;
};

export async function getPrices(): Promise<Prices> {
  const res = await fetch("https://scanner.tradingview.com/cfd/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      symbols: {
        tickers: [
          "TVC:GOLD",
          "TVC:PLATINUM",
          "TVC:SILVER",
          "OANDA:XAUUSD",
          "PEPPERSTONE:XAUUSD",
          "FOREXCOM:XAUUSD",
          "FX_IDC:XAUUSD",
          "FX_IDC:USDKRW",
        ],
        query: { types: [] },
      },
      columns: ["close", "change_abs", "change", "bid", "ask"],
    }),
    cache: "no-store",
  });

  const data = await res.json();

  type Row = {
    s: string;
    d: number[];
  };

  console.log(data.data);
  const gold = data.data.find((d: Row) => d.s === "TVC:GOLD").d;
  const platinum = data.data.find((d: Row) => d.s === "TVC:PLATINUM").d;
  const silver = data.data.find((d: Row) => d.s === "TVC:SILVER").d;

  const fx = await fetch("https://scanner.tradingview.com/forex/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      symbols: {
        tickers: ["FX_IDC:USDKRW"],
        query: { types: [] },
      },
      columns: ["close", "change_abs"],
    }),
    cache: "no-store",
  });
  const fxData = await fx.json();
  const usdkrw = fxData.data.find((d: Row) => d.s === "FX_IDC:USDKRW").d;
  const rate = usdkrw[0]; // KRW per USD

  const OZ_TO_GRAM = 31.1035;
  const DON = 3.75;

  // convert USD/oz → KRW per 돈
  const toKrwPerDon = (usdPerOz: number) => Math.round((usdPerOz / OZ_TO_GRAM) * DON * rate);

  const goldKrw = toKrwPerDon(gold[0]);
  const gold18k = Math.round(goldKrw * (18 / 24));
  const gold14k = Math.round(goldKrw * (14 / 24));
  const platKrw = toKrwPerDon(platinum[0]);
  const silverKrw = toKrwPerDon(silver[0]);

  return {
    goldKrw,
    gold18k,
    gold14k,
    platKrw,
    silverKrw,
    goldUsd: gold[0],
    goldChangeAbs: gold[1],
    goldChange: gold[2],
    goldBid: gold[3],
    goldAsk: gold[4],
    silverUsd: silver[0],
    silverChangeAbs: silver[1],
    silverChange: silver[2],
    silverBid: silver[3],
    silverAsk: silver[4],
    platUsd: platinum[0],
    platChangeAbs: platinum[1],
    platChange: platinum[2],
    platBid: platinum[3],
    platAsk: platinum[4],
    rate,
  };
}
