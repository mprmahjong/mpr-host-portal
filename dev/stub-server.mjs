// A stand-in for the two platform endpoints the portal calls, serving the
// portal itself from this checkout on the same localhost origin. For
// clicking through a branch before it merges: no production, no platform,
// no env change, nothing written anywhere. A Submit lands here and is
// printed, never rated. The roster is made up.
//
//   node dev/stub-server.mjs          then open  http://localhost:4173/dev-login
//
// /dev-login plants a pretend portal token (the real one comes from the
// authorize popup) and opens the portal pointed at this server. The event's
// access code is 123456.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT || 4173);
const PORTAL = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "index.html");
const players = [
  { id: "u_amy", kind: "account", name: "Amy Adler", email: "amy@example.com", rating: "6.12", membershipStatus: "ACTIVE", club: { id: "club_1", name: "Sparrow" } },
  { id: "u_ben", kind: "account", name: "Ben Brooks", email: "ben@example.com", rating: "5.40", membershipStatus: "ACTIVE", club: null },
  { id: "u_cyd", kind: "account", name: "Cydnee Dubrof", email: "cyd@example.com", rating: "7.02", membershipStatus: "ACTIVE", club: { id: "club_1", name: "Sparrow" } },
  { id: "u_dee", kind: "account", name: "Dee Dawson", email: "dee@example.com", rating: "4.88", membershipStatus: "GUEST", club: null },
  { id: "u_eva", kind: "account", name: "Eva Evans", email: "eva@example.com", rating: "6.50", membershipStatus: "ACTIVE", club: null },
  { id: "p_fay", kind: "record", name: "Fay Fisher", email: "fay@example.com", rating: null, membershipStatus: "RECORD", club: null },
  { id: "u_gus", kind: "account", name: "Gus Grant", email: "gus@example.com", rating: "5.95", membershipStatus: "ACTIVE", club: null },
  { id: "u_hal", kind: "account", name: "Hal Hughes", email: "hal@example.com", rating: "6.80", membershipStatus: "ACTIVE", club: null },
];
const event = { id: "evt_stub", title: "Stub Monday Open Play", startAt: new Date().toISOString(), city: "Atlanta", stateCode: "GA", hostCode: "123456", hostClub: { id: "club_1", code: "SPARROW", name: "Sparrow" } };

http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const json = (status, body) => { res.writeHead(status, { "content-type": "application/json", "cache-control": "no-store" }); res.end(JSON.stringify(body)); };
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
  if (url.pathname === "/" || url.pathname === "/index.html") { res.writeHead(200, { "content-type": "text/html", "cache-control": "no-store" }); return res.end(fs.readFileSync(PORTAL)); }
  if (url.pathname === "/dev-login") {
    res.writeHead(200, { "content-type": "text/html" });
    return res.end(`<!doctype html><script>sessionStorage.setItem("mpr_results_portal_authorization", JSON.stringify({ token: "stub", expiresAt: new Date(Date.now() + 8 * 3600e3).toISOString() })); location.replace("/?apiBase=http://localhost:${PORT}");</script>`);
  }
  if (url.pathname.startsWith("/api/results/events/")) {
    if (url.pathname.split("/").pop() !== "123456") return json(404, { error: { code: "event_not_found", message: "No event matches this host code" } });
    return json(200, { data: { event, players } });
  }
  if (url.pathname === "/api/results/sessions" && req.method === "POST") {
    let raw = ""; req.on("data", (c) => (raw += c)); req.on("end", () => {
      console.log("\n--- SUBMIT received (not rated, not stored) ---\n" + JSON.stringify(JSON.parse(raw), null, 2));
      json(201, { data: { sessionId: "stub-session", duplicate: false } });
    }); return;
  }
  if (url.pathname.startsWith("/api/results/sessions/") && req.method === "DELETE") { console.log("--- UNDO received ---"); return json(200, { data: { ok: true } }); }
  json(404, { error: { code: "not_found", message: "no such route" } });
}).listen(PORT, () => console.log(`Portal stub on http://localhost:${PORT}/dev-login  (access code 123456)`));
