import { useEffect, useState } from "react";
import { getHealth } from "./api.js";
import AnalyzerPanel from "./components/AnalyzerPanel.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./components/Hero.jsx";
import Navbar from "./components/Navbar.jsx";
import SafetyAssistant from "./components/SafetyAssistant.jsx";
import SecurityStatusDashboard from "./components/SecurityStatusDashboard.jsx";
import URLInspector from "./components/URLInspector.jsx";

export default function App() {
  const [backendOnline, setBackendOnline] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getHealth().then(({ data }) => setBackendOnline(Boolean(data)));
  }, [refreshKey]);

  return (
    <div className="min-h-screen bg-void font-body">
      <Navbar backendOnline={backendOnline} />
      <Hero />

      <main className="mx-auto max-w-7xl space-y-10 px-6 py-14">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <AnalyzerPanel onAnalyzed={() => setRefreshKey((k) => k + 1)} />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-5">
            <SecurityStatusDashboard refreshKey={refreshKey} />
            <SafetyAssistant />
          </div>
        </div>

        <URLInspector onChecked={() => setRefreshKey((k) => k + 1)} />
      </main>

      <Footer />
    </div>
  );
}
