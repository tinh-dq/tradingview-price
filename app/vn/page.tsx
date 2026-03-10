import GoldChart from "@/components/GoldChart";
import { getVietnamGoldPrices } from "@/lib/getVietnamGoldPrices";

export default async function GoldPricePage() {
  const prices = await getVietnamGoldPrices();

  // Hàm format tiền tệ VNĐ
  const formatVND = (value: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 min-h-screen">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-yellow-600 uppercase tracking-tight">
          Bảng Giá Vàng Thế Giới Quy Đổi (VND)
        </h1>
        <p className="text-gray-500 mt-2">
          Tỷ giá cập nhật: 1 USD = {prices.rateVnd.toLocaleString()} VND
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thẻ hiển thị giá vàng miếng/nhẫn 24K */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-yellow-100 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase">Vàng 24K (999.9)</h2>
            <p className="text-4xl font-black text-gray-800 mt-2">
              {formatVND(prices.goldVndLuong)}
            </p>
            <p className="text-sm text-gray-500">mỗi Lượng (Cây)</p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-gray-600 text-sm">Giá mỗi chỉ:</span>
            <span className="font-bold text-yellow-700">{formatVND(prices.goldVndChi)}</span>
          </div>
        </div>

        {/* Thẻ hiển thị giá Vàng Thế giới (USD) */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-sm text-white">
          <h2 className="text-sm font-semibold text-slate-400 uppercase">Giá Thế Giới (XAU/USD)</h2>
          <p className="text-4xl font-black mt-2">${prices.goldUsd.toLocaleString()}</p>
          <div
            className={`mt-2 flex items-center text-sm ${prices.goldChange >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            <span>
              {prices.goldChange >= 0 ? "▲" : "▼"} {prices.goldChange.toFixed(2)}%
            </span>
            <span className="ml-2 text-slate-400">({prices.goldChangeAbs} USD)</span>
          </div>
        </div>
      </div>

      {/* Bảng chi tiết các loại vàng khác */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
              <th className="p-4 font-semibold">Loại Kim Loại</th>
              <th className="p-4 font-semibold text-right">Giá mỗi Chỉ</th>
              <th className="p-4 font-semibold text-right">Giá mỗi Lượng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-black">
            <tr>
              <td className="p-4 font-medium">Vàng 18K (75%)</td>
              <td className="p-4 text-right">{formatVND(prices.gold18kChi)}</td>
              <td className="p-4 text-right text-gray-400">{formatVND(prices.gold18kChi * 10)}</td>
            </tr>
            <tr>
              <td className="p-4 font-medium">Vàng 14K (58.3%)</td>
              <td className="p-4 text-right">{formatVND(prices.gold14kChi)}</td>
              <td className="p-4 text-right text-gray-400">{formatVND(prices.gold14kChi * 10)}</td>
            </tr>
            <tr>
              <td className="p-4 font-medium">Bạch Kim (Platinum)</td>
              <td className="p-4 text-right">{formatVND(prices.platVndChi)}</td>
              <td className="p-4 text-right text-gray-400">{formatVND(prices.platVndChi * 10)}</td>
            </tr>
            <tr className="text-blue-600">
              <td className="p-4 font-medium">Bạc (Silver)</td>
              <td className="p-4 text-right">{formatVND(prices.silverVndChi)}</td>
              <td className="p-4 text-right text-gray-400">
                {formatVND(prices.silverVndChi * 10)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="lg:col-span-2">
        <GoldChart />
      </div>

      <footer className="mt-6 text-center text-xs text-gray-400 italic">
        * Lưu ý: Giá trên được quy đổi từ sàn TradingView, chưa bao gồm thuế, phí và chênh lệch SJC
        tại Việt Nam.
      </footer>
    </div>
  );
}
