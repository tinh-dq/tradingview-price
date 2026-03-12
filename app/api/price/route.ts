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
          priceGram: i.priceGram,
          bidDiff: i.bidDiff,
          askDiff: i.askDiff,
        },
      ])
    );

    const official = {
      gold24: {
        buy: json.officialPrice4.p_pure,
        sell: json.officialPrice4.s_pure,
        buyDiff: json.officialPrice4.turm_p_pure,
        sellDiff: json.officialPrice4.turm_s_pure,
      },
      gold18: {
        buy: json.officialPrice4.p_18k,
        sell: json.officialPrice4.s_18k,
        buyDiff: json.officialPrice4.turm_p_18k,
        sellDiff: json.officialPrice4.turm_s_18k,
      },
      gold14: {
        buy: json.officialPrice4.p_14k,
        sell: json.officialPrice4.s_14k,
        buyDiff: json.officialPrice4.turm_p_14k,
        sellDiff: json.officialPrice4.turm_s_14k,
      },
      silver: {
        buy: json.officialPrice4.p_silver,
        sell: json.officialPrice4.s_silver,
        buyDiff: json.officialPrice4.turm_p_silver,
        sellDiff: json.officialPrice4.turm_s_silver,
      },
      platinum: {
        buy: json.officialPrice4.p_white,
        sell: json.officialPrice4.s_white,
        buyDiff: json.officialPrice4.turm_p_white,
        sellDiff: json.officialPrice4.turm_s_white,
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
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
    // eslint-disable-next-line
  } catch (err) {
    return NextResponse.json({ error: "Get price error" }, { status: 500 });
  }
}
