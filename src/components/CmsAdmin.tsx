import { useState, useEffect } from "react";
import { X, RefreshCw, Database } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

declare global {
  const google: any;
}

export function CmsAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Add Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    document.body.appendChild(script);

    // Check hash to open panel
    const handleHash = () => {
      if (window.location.hash === "#admin") setIsOpen(true);
      else setIsOpen(false);
    };
    window.addEventListener("hashchange", handleHash);
    handleHash();
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleSync = () => {
    if (!spreadsheetId) {
      setStatus("Please enter a Spreadsheet ID");
      return;
    }
    
    setLoading(true);
    setStatus("Waiting for authentication...");

    const client = google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
      scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
      callback: async (response) => {
        if (response.error) {
          setStatus("Auth error: " + response.error);
          setLoading(false);
          return;
        }
        
        setStatus("Syncing data...");
        try {
          const res = await fetch("/api/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              token: response.access_token,
              spreadsheetId 
            })
          });
          const data = await res.json();
          if (data.success) {
            setStatus(`Synced successfully! Loaded ${data.rows} rows.`);
            setTimeout(() => window.location.reload(), 2000);
          } else {
            setStatus("Sync failed: " + data.error);
          }
        } catch (err: any) {
          setStatus("Error: " + err.message);
        }
        setLoading(false);
      },
    });

    client.requestAccessToken();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 w-96 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl z-50 overflow-hidden text-white font-mono"
        >
          <div className="flex justify-between items-center p-4 border-b border-zinc-800 bg-black/50">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#00FF41]" />
              <span className="text-sm font-bold uppercase tracking-wider">CMS Sync</span>
            </div>
            <button onClick={() => window.location.hash = ""} className="text-zinc-500 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 flex flex-col gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-2">Google Sheet ID</label>
              <input 
                type="text" 
                value={spreadsheetId}
                onChange={e => setSpreadsheetId(e.target.value)}
                placeholder="1BxiMVs0XRY..."
                className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00FF41] transition-colors"
              />
              <p className="text-[10px] text-zinc-500 mt-2">
                Make sure your sheet is named "Sheet1" and has the columns:
                ID, Title (UK), Type (UK), Title (EN), Type (EN)
              </p>
            </div>

            <button 
              onClick={handleSync}
              disabled={loading}
              className="w-full bg-[#00FF41] hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-widest py-3 rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {loading ? "Syncing..." : "Sync from Google Sheets"}
            </button>

            {status && (
              <div className="text-xs text-center text-zinc-400 mt-2 p-2 bg-black/50 rounded">
                {status}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
