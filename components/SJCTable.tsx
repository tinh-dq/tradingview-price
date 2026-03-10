import { formatVND, getSJCPrices } from "@/lib/sjc";

export default async function SJCTable() {
  const data = await getSJCPrices();

  return (
    <div className="space-y-4 mt-10">
      <div className="text-2xl font-bold">Giá vàng SJC</div>
      <div className="flex max-md:flex-col justify-between">
        <div className="text-foreground text-2xl">
          Cập nhật lúc: <span className="text-2xl font-semibold">{data.latestDate}</span>
        </div>

        <div className="text-foreground text-2xl">
          Đơn vị: <span className="font-semibold">VNĐ / lượng</span>
        </div>
      </div>

      <table className="w-full border uppercase">
        <thead className="bg-[#005387] text-white">
          <tr>
            <th className="text-left p-3">Loại vàng</th>
            <th className="text-right p-3">Mua</th>
            <th className="text-right p-3">Bán</th>
          </tr>
        </thead>

        <tbody>
          {data.items.map((item) => (
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
