import { handle, send } from "../lib/http.js";
import { clearCookie } from "../lib/auth.js";
export default handle(async (req, res) => send(res, 200, { ok: true }, { "Set-Cookie": clearCookie() }));
