"use client";

import React, { useEffect, useRef } from "react";

export default function GoldChart() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentContainer = container.current;
    if (!currentContainer) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "PEPPERSTONE:XAUUSD",
      interval: "5",
      timezone: "Asia/Ho_Chi_Minh",
      theme: "light",
      style: "1",
      locale: "vi_VN",
      allow_symbol_change: false,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });

    currentContainer.appendChild(script);

    // Cleanup khi component unmount
    return () => {
      if (currentContainer) {
        currentContainer.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-gray-700">Biểu đồ Vàng Thế giới (XAU/USD)</h3>
        <span className="text-xs text-gray-400">Nguồn: TradingView</span>
      </div>
      <div className="h-112 w-full" ref={container}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
}
