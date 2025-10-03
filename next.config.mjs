const isProd = process.env.NODE_ENV === "production";

const upstashUrl = process.env.UPSTASH_REDIS_REST_URL || "";
let upstashOrigin = "";
try {
  upstashOrigin = upstashUrl ? new URL(upstashUrl).origin : "";
} catch {}

function buildCSP() {
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${
      isProd ? "" : " 'unsafe-eval' 'wasm-unsafe-eval'"
    }`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src 'self' ${upstashOrigin} https://*.upstash.io`,
    "form-action 'self'",
    "base-uri 'self'",
    "report-to csp-endpoint",
    "report-uri /api/csp-report",
    "frame-ancestors 'none'",
  ];
  return directives.join("; ");
}

const securityHeaders = [
  { key: "Content-Security-Policy", value: buildCSP() },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "geolocation=(), microphone=(), camera=()",
  },
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  {
    key: "Report-To",
    value: `{"group":"csp-endpoint","max_age":10886400,"endpoints":[{"url":"/api/csp-report"}]}`,
  },
];

const nextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },

  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;