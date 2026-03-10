import { Container } from "@/components/Container";
import GoldChart from "@/components/GoldChart";
import SJCTable from "@/components/SJCTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giá vàng",
  description: "Giá vàng SJC và thế giới",
};
export default function SJC() {
  return (
    <Container className="space-y-10 py-10">
      <GoldChart />
      <SJCTable />
    </Container>
  );
}
