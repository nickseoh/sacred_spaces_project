import { handle, send } from "../lib/http.js";
import { getSession } from "../lib/auth.js";
export default handle(async (req, res) => {
  const s = getSession(req);
  send(res, 200, s ? { signedIn: true, email: s.e, mock: process.env.MOCK_AI === "true" } : { signedIn: false });
}, { method: "GET" });
