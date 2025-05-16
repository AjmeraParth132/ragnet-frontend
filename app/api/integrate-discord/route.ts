import { NextResponse } from "next/server"

// This is a mock implementation - in a real app, you would redirect
// to Discord OAuth and handle the integration
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const repoId = searchParams.get("repoId")

  if (!repoId) {
    return NextResponse.json({ message: "Repository ID is required" }, { status: 400 })
  }

  // In a real implementation, you would:
  // 1. Redirect to Discord OAuth
  // 2. Handle the callback
  // 3. Store the Discord integration details

  // For demo purposes, we'll just return HTML that explains what would happen
  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>Discord Integration</title>
        <style>
          body {
            font-family: system-ui, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 2rem;
            line-height: 1.5;
          }
          h1 {
            color: #5865F2;
          }
          .steps {
            background: #f9f9f9;
            padding: 1rem;
            border-radius: 0.5rem;
          }
        </style>
      </head>
      <body>
        <h1>Discord Integration</h1>
        <p>This is a placeholder for the Discord integration flow. In a real application, you would be redirected to Discord's OAuth page to authorize the integration.</p>
        
        <div class="steps">
          <h2>Integration Steps:</h2>
          <ol>
            <li>Authorize Ragnet to access your Discord server</li>
            <li>Select the server where you want to add the Ragnet bot</li>
            <li>Configure which channels the bot can access</li>
            <li>Complete the integration</li>
          </ol>
        </div>
        
        <p>After integration, users in your Discord server would be able to query the repository (ID: ${repoId}) by mentioning the Ragnet bot.</p>
        
        <button onclick="window.close()">Close Window</button>
      </body>
    </html>`,
    {
      headers: {
        "Content-Type": "text/html",
      },
    },
  )
}
