import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Missing authorization code" },
        { status: 400 }
      );
    }

    const clientId = process.env.SLACK_CLIENT_ID;
    const clientSecret = process.env.SLACK_CLIENT_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : "http://localhost:3000";

    if (!clientId || !clientSecret) {
      console.error("Missing Slack credentials");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Exchange code for access token
    const tokenRes = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.ok) {
      console.error("Slack token exchange failed:", tokenData);
      return NextResponse.json(
        { error: tokenData.error || "Failed to exchange token" },
        { status: 400 }
      );
    }

    // Extract tokens and info
    const botToken = tokenData.access_token;
    const userId = tokenData.authed_user?.id;
    const teamName = tokenData.team?.name;
    const teamId = tokenData.team?.id;

    // For Socket Mode, we need an app-level token
    // This requires the app to have connections:write scope
    // For simplicity, we'll return what we have and note that app token
    // should be configured separately or use Events API instead
    
    return NextResponse.json({
      botToken,
      appToken: "", // App token needs to be generated separately via Slack admin
      userId,
      teamName,
      teamId,
    });
  } catch (err) {
    console.error("Slack callback error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
