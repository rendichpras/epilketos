export async function POST(req: Request) {
  try {
    const report = await req.json();
    console.warn("CSP violation:", JSON.stringify(report));
  } catch {
  }
  return new Response(null, { status: 204 });
}
