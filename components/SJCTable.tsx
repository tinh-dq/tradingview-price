"use client";

import { formatVND, getSJCPrices, SJCItem } from "@/lib/sjc";
import { useEffect, useState } from "react";
export default function SJCTable() {
  const [items, setItems] = useState<SJCItem[]>([]);
  const [latestDate, setLatestDate] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadData() {
    setLoading(true);

    try {
      const data = await getSJCPrices();
      setItems(data.items);
      setLatestDate(data.latestDate);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-4 mt-10">
      <div className="text-2xl font-bold">Giá vàng SJC</div>
      <div className="flex max-md:flex-col justify-between text-lg md:text-2xl">
        <div className="text-foreground">
          Cập nhật lúc: <span className="font-semibold">{latestDate}</span>
        </div>

        <div className="text-foreground">
          Đơn vị: <span className="font-semibold">VNĐ / lượng</span>
        </div>
      </div>

      <button
        onClick={loadData}
        disabled={loading}
        className="px-4 py-2 rounded bg-[#eed186] text-black hover:opacity-80 disabled:opacity-50 font-semibold"
      >
        {loading ? "Đang cập nhật..." : "Cập nhật giá"}
      </button>

      <table className="w-full border border-[#eed186] uppercase">
        <thead className="bg-[#005387] text-white">
          <tr>
            <th className="text-left p-3">Loại vàng</th>
            <th className="text-right p-3">Mua</th>
            <th className="text-right p-3">Bán</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border">
              <td className="p-3 font-semibold">{item.typeName}</td>

              <td className="p-3 text-right font-bold">{formatVND(item.buyValue)}</td>

              <td className="p-3 text-right font-bold">{formatVND(item.sellValue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
