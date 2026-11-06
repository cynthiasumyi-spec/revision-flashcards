import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const USERNAME = /^[a-z][a-z0-9_]{2,19}$/;
const DOMAIN = "learners.localhost";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: cors });
}

function clientIp(req: Request) {
  const real = (req.headers.get("x-real-ip") || "").trim();
  if (real) return real.slice(0, 64);
  const parts = (req.headers.get("x-forwarded-for") || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return (parts.length ? parts[parts.length - 1] : "unknown").slice(0, 64);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return json(405, { error: "Sign-up only accepts a form post." });

  const url = Deno.env.get("SUPABASE_URL") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!url || !serviceKey) return json(500, { error: "Sign-up is not available yet." });

  let payload: { username?: string; password?: string };
  try {
    const raw = await req.text();
    if (raw.length > 2000) return json(400, { error: "That sign-up could not be read." });
    payload = JSON.parse(raw);
  } catch (_error) {
    return json(400, { error: "That sign-up could not be read." });
  }

  const username = String(payload.username || "").trim().toLowerCase();
  const password = String(payload.password || "");
  if (!USERNAME.test(username)) {
    return json(400, {
      error: "Use a username with 3–20 letters, numbers, or underscores. Start with a letter.",
    });
  }
  if (password.length < 6 || password.length > 72) {
    return json(400, { error: "Use a password with 6 to 72 characters." });
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: allowed, error: limitError } = await admin.rpc("signup_allowed", {
    client_ip: clientIp(req),
  });
  if (limitError) {
    console.error("signup limit check failed", limitError.message);
  } else if (allowed !== true) {
    return json(429, { error: "Too many new accounts from this network. Try again later." });
  }

  const { data: existing, error: lookupError } = await admin
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();
  if (lookupError) {
    console.error("username lookup failed", lookupError.message);
    return json(500, { error: "Could not create the account. Try again." });
  }
  if (existing) return json(409, { error: "That username is taken." });

  const { error: createError } = await admin.auth.admin.createUser({
    email: `${username}@${DOMAIN}`,
    password,
    email_confirm: true,
    user_metadata: { username },
  });
  if (createError) {
    const message = createError.message || "";
    console.error("createUser failed", message);
    if (/already|registered|taken|duplicate|invalid username/i.test(message)) {
      return json(409, { error: "That username is taken." });
    }
    if (/password/i.test(message) && message.length < 180 && !message.includes("@")) {
      return json(400, { error: message });
    }
    return json(500, { error: "Could not create the account. Try again." });
  }

  return json(200, { ok: true, username });
});
