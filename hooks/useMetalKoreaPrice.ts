"use client";

import { useEffect, useRef, useState } from "react";

type Quote = {
  price: number | null;
  change: number | null;
  changePercent: number | null;
  prevClose: number | null;
  high: number | null;
  low: number | null;
};

type Prices = {
  xau: Quote;
  xag: Quote;
  xpt: Quote;
  usdkrw: Quote;
};

const emptyQuote: Quote = {
  price: null,
  change: null,
  changePercent: null,
  prevClose: null,
  high: null,
  low: null,
};

export function useMetalKoreaPrice() {
  const [prices, setPrices] = useState<Prices>({
    xau: emptyQuote,
    xag: emptyQuote,
    xpt: emptyQuote,
    usdkrw: emptyQuote,
  });

  const wsRef = useRef<WebSocket | null>(null);

  const sendPacket = (obj: object) => {
    if (!wsRef.current) return;
    const str = JSON.stringify(obj);
    wsRef.current.send(`~m~${str.length}~m~${str}`);
  };

  useEffect(() => {
    const ws = new WebSocket("wss://data.tradingview.com/socket.io/websocket");

    wsRef.current = ws;

    ws.onopen = () => {
      const session = "qs_metals";

      // create quote session
      sendPacket({
        m: "quote_create_session",
        p: [session],
      });

      const symbols = ["OANDA:XAUUSD", "OANDA:XAGUSD", "OANDA:XPTUSD", "FX_IDC:USDKRW"];

      symbols.forEach((s) =>
        sendPacket({
          m: "quote_add_symbols",
          p: [session, s],
        })
      );
    };

    ws.onmessage = (event) => {
      const text = event.data as string;

      if (text.startsWith("~h~")) {
        ws.send(text);
        return;
      }

      const packets = text.split("~m~");

      packets.forEach((p) => {
        if (!p.startsWith("{")) return;

        try {
          const data = JSON.parse(p);
          console.log(data);
          const symbol = data?.p?.[1]?.n;
          const v = data?.p?.[1]?.v;

          if (!v) return;
          if (!symbol || v.lp === undefined) return;

          const quote: Quote = {
            price: v.lp ?? null,
            change: v.ch ?? null,
            changePercent: v.chp ?? null,
            prevClose: v.prev_close ?? null,
            high: v.high_price ?? null,
            low: v.low_price ?? null,
          };

          setPrices((prev) => {
            if (symbol === "OANDA:XAUUSD") return { ...prev, xau: quote };
            if (symbol === "OANDA:XAGUSD") return { ...prev, xag: quote };
            if (symbol === "OANDA:XPTUSD") return { ...prev, xpt: quote };
            if (symbol === "FX_IDC:USDKRW") return { ...prev, usdkrw: quote };

            return prev;
          });
        } catch {}
      });
    };

    return () => ws.close();
  }, []);

  const convert = (usdPerOz: number | null, rate: number | null) => {
    if (!usdPerOz || !rate) return null;

    const krwPerOz = usdPerOz * rate;
    const gram = krwPerOz / 31.1035;
    const don = gram * 3.75;

    return { gram, don };
  };

  const goldBase = convert(prices.xau.price, prices.usdkrw.price);
  const silverBase = convert(prices.xag.price, prices.usdkrw.price);
  const platinumBase = convert(prices.xpt.price, prices.usdkrw.price);

  return {
    usdkrw: prices.usdkrw,
    xau: prices.xau,
    xag: prices.xag,
    xpt: prices.xpt,

    gold: {
      gram24: goldBase?.gram ?? null,
      don24: goldBase?.don ?? null,
      gram18: goldBase ? goldBase.gram * 0.75 : null,
      don18: goldBase ? goldBase.don * 0.75 : null,
      gram14: goldBase ? goldBase.gram * 0.585 : null,
      don14: goldBase ? goldBase.don * 0.585 : null,
    },

    silver: {
      gram: silverBase?.gram ?? null,
      don: silverBase?.don ?? null,
    },

    platinum: {
      gram: platinumBase?.gram ?? null,
      don: platinumBase?.don ?? null,
    },
  };
}
