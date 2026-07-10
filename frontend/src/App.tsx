import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BookOpen, Plus, Library, BarChart3 } from "lucide-react";
import { fetchPapers, healthCheck } from "./api";
import { ResearchPaper } from "./types";
import { AddPaper } from "./components/AddPaper";
import { PaperLibrary } from "./components/PaperLibrary";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";

type View = "add" | "library" | "analytics";

export const App: React.FC = () => {
  const [view, setView] = useState<View>("library");
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverOnline, setServerOnline] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const online = await healthCheck();
        setServerOnline(online);

        if (online) {
          const data = await fetchPapers();
          setPapers(data);
        }
      } catch (error) {
        console.error("Failed to load papers:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handlePaperAdded = (newPaper: ResearchPaper) => {
    setPapers((prev) => [newPaper, ...prev]);
    setView("library");
  };

  const handlePaperDeleted = (id: string) => {
    setPapers((prev) => prev.filter((p) => p.id !== id));
  };

  const navItems = [
    { id: "add" as View, label: "Add Paper", icon: Plus },
    { id: "library" as View, label: "Paper Library", icon: Library },
    { id: "analytics" as View, label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-cyan-600">
      <Toaster position="top-right" />

      {!serverOnline && !loading && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <p className="text-red-800 text-sm font-medium">
            Backend server is not running. Make sure to start the backend on
            port 5000.
          </p>
        </div>
      )}

      <header className="bg-slate-100 border-b border-slate-200 sticky top-0 z-40">
        <div className=" px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex justify-between mx-16">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Research Paper Tracker
                  </h1>
                  <p className="text-sm text-slate-500">
                    Organize, track, and analyze your research papers
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl">
                <Library className="w-4 h-4" />
                <span className="text-sm font-semibold">{papers.length}</span>
                <span className="text-sm text-slate-500">papers</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="border-slate-100 border-b bg-white sticky mt-6 rounded-2xl max-w-fit mx-auto z-30">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`relative px-4 py-4 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-indigo-600" : ""}`}
                  />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.label.split(" ")[0]}</span>
                </div>
                {isActive && (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-indigo-600 " />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <section className="sm:hidden fixed bottom-0 left-3 right-0 bg-white  border-slate-200 z-40">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200 ${
                  isActive ? "text-indigo-600" : "text-slate-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">
                  {item.label.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 sm:pb-8">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4 mx-auto" />
              <p className="text-slate-500 text-lg font-medium">
                Loading application...
              </p>
            </div>
          </div>
        ) : view === "add" ? (
          <AddPaper onPaperAdded={handlePaperAdded} />
        ) : view === "library" ? (
          <PaperLibrary papers={papers} onPaperDeleted={handlePaperDeleted} />
        ) : (
          <AnalyticsDashboard papers={papers} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-slate-500 text-center">
            Research Paper Reading Tracker &copy; 2026 &bull; Built with React,
            TypeScript & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
