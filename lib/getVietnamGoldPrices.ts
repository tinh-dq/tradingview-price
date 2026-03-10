export type VngoldPrices = {
  goldVndLuong: number; // Giá vàng 24k (9999) mỗi lượng
  goldVndChi: number; // Giá vàng 24k (9999) mỗi chỉ
  gold18kChi: number; // Giá vàng 18k mỗi chỉ
  gold14kChi: number; // Giá vàng 14k mỗi chỉ
  platVndChi: number; // Giá bạch kim mỗi chỉ
  silverVndChi: number; // Giá bạc mỗi chỉ
  goldUsd: number;
  goldChangeAbs: number;
  goldChange: number;
  rateVnd: number; // Tỷ giá USD/VND
  // ... các trường khác nếu bạn cần
};

export async function getVietnamGoldPrices(): Promise<VngoldPrices> {
  // 1. Lấy dữ liệu giá kim loại từ TradingView
  const res = await fetch("https://scanner.tradingview.com/cfd/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      symbols: {
        tickers: ["TVC:GOLD", "TVC:PLATINUM", "TVC:SILVER"],
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

  const gold = data.data.find((d: Row) => d.s === "TVC:GOLD").d;
  const platinum = data.data.find((d: Row) => d.s === "TVC:PLATINUM").d;
  const silver = data.data.find((d: Row) => d.s === "TVC:SILVER").d;
  console.log(gold, platinum, silver);
  // 2. Lấy tỷ giá USD/VND
  const fx = await fetch("https://scanner.tradingview.com/forex/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      symbols: {
        tickers: ["FX_IDC:USDVND"],
        query: { types: [] },
      },
      columns: ["close"],
    }),
    cache: "no-store",
  });

  const fxData = await fx.json();
  const usdvnd = fxData.data.find((d: Row) => d.s === "FX_IDC:USDVND").d;
  const rateVnd = usdvnd[0];

  // 3. Quy đổi đơn vị
  const OZ_TO_GRAM = 31.1034768;
  const CHI_TO_GRAM = 3.75; // 1 chỉ = 3.75 gram
  const LUONG_TO_GRAM = 37.5; // 1 lượng = 10 chỉ = 37.5 gram

  /**
   * Công thức: (Giá thế giới / 31.1035) * 3.75 * Tỷ giá
   * Lưu ý: Đây là giá quy đổi từ thế giới, chưa bao gồm thuế và phí nhập khẩu tại VN
   */
  const toVndPerChi = (usdPerOz: number) =>
    Math.round((usdPerOz / OZ_TO_GRAM) * CHI_TO_GRAM * rateVnd);
  const toVndPerLuong = (usdPerOz: number) =>
    Math.round((usdPerOz / OZ_TO_GRAM) * LUONG_TO_GRAM * rateVnd);

  const goldVndChi = toVndPerChi(gold[0]);
  const goldVndLuong = toVndPerLuong(gold[0]);

  return {
    goldVndLuong,
    goldVndChi,
    gold18kChi: Math.round(goldVndChi * 0.75), // 18k thường tính là 75%
    gold14kChi: Math.round(goldVndChi * 0.583), // 14k thường tính là 58.3%
    platVndChi: toVndPerChi(platinum[0]),
    silverVndChi: toVndPerChi(silver[0]),
    goldUsd: gold[0],
    goldChangeAbs: gold[1],
    goldChange: gold[2],
    rateVnd,
  };
}
