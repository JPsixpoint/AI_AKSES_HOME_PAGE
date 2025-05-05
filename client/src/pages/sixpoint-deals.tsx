import { SixpointDealsDashboard } from "@/components/sixpoint/sixpoint-deals-dashboard";
import { Header } from "@/components/layout/header";

export default function SixpointDealsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <SixpointDealsDashboard />
      </main>
    </div>
  );
}