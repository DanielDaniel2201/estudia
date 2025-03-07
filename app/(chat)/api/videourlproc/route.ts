export async function POST(request: Request) {
try {
  const { videoUrl }: {videoUrl: string} = await request.json();
  console.log("videoUrl: ", videoUrl);
  return new Response(JSON.stringify({ videoUrl }), { status: 200 });
} catch (error) {
  console.error("Error processing YouTube link:", error);
  return new Response("Error processing YouTube link", { status: 500 });
}
}