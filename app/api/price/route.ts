import { NextResponse } from "next/server";

const API = "https://koreagoldx.co.kr/api/main";

type Market = {
  type: string;
  bid: number;
  ask: number;
  priceGram: number;
  bidDiff: number;
  askDiff: number;
  bidDiffPer: number;
  askDiffPer: number;
};

export async function GET() {
  try {
    const res = await fetch(API, {
      next: { revalidate: 60 }, // cache 60 seconds
    });

    const json = await res.json();

    const market = Object.fromEntries(
      json.marketPriceList.map((i: Market) => [
        i.type,
        {
          bid: i.bid,
          ask: i.ask,
          gram: i.priceGram,
          change: i.bidDiff,
          changePercent: i.bidDiffPer,
        },
      ])
    );

    const official = {
      gold24: {
        buy: json.officialPrice4.p_pure,
        sell: json.officialPrice4.s_pure,
        change: json.officialPrice4.turm_p_pure,
        changePercent: json.officialPrice4.per_p_pure,
      },
      gold18: {
        buy: json.officialPrice4.p_18k,
        sell: json.officialPrice4.s_18k,
        change: json.officialPrice4.turm_p_18k,
        changePercent: json.officialPrice4.per_p_18k,
      },
      gold14: {
        buy: json.officialPrice4.p_14k,
        sell: json.officialPrice4.s_14k,
        change: json.officialPrice4.turm_p_14k,
        changePercent: json.officialPrice4.per_p_14k,
      },
      silver: {
        buy: json.officialPrice4.p_silver,
        sell: json.officialPrice4.s_silver,
        change: json.officialPrice4.turm_p_silver,
        changePercent: json.officialPrice4.per_p_silver,
      },
      platinum: {
        buy: json.officialPrice4.p_white,
        sell: json.officialPrice4.s_white,
        change: json.officialPrice4.turm_p_white,
        changePercent: json.officialPrice4.per_p_white,
      },
    };

    return NextResponse.json(
      {
        updated: json.date,
        market,
        official,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60",
        },
      }
    );
    // eslint-disable-next-line
  } catch (err) {
    return NextResponse.json({ error: "Get price error" }, { status: 500 });
  }
}
