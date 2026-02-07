import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { agentName, slackUserId, botToken, appToken } = await req.json();

    // Validate inputs
    if (!agentName || !slackUserId || !botToken) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate agent name format
    const sanitizedName = agentName.toLowerCase().replace(/\s+/g, "-");
    if (!/^[a-z0-9-]+$/.test(sanitizedName)) {
      return NextResponse.json(
        { error: "Invalid agent name format" },
        { status: 400 }
      );
    }

    const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || "http://localhost:18789";
    const gatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN;

    // Build the config patch
    // This adds a new agent, Slack account, and binding
    const configPatch = {
      agents: {
        list: [
          {
            id: sanitizedName,
            workspace: `./workspaces/${sanitizedName}`,
          },
        ],
      },
      channels: {
        slack: {
          accounts: {
            [sanitizedName]: {
              botToken: botToken,
              ...(appToken && { appToken }),
              dm: {
                policy: "allowlist",
                allowFrom: [slackUserId],
              },
            },
          },
        },
      },
      bindings: [
        {
          match: {
            channel: "slack",
            accountId: sanitizedName,
          },
          agentId: sanitizedName,
        },
      ],
    };

    // Call OpenClaw config.patch
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (gatewayToken) {
      headers["Authorization"] = `Bearer ${gatewayToken}`;
    }

    const patchRes = await fetch(`${gatewayUrl}/rpc`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "config.patch",
        params: {
          raw: JSON.stringify(configPatch),
          reason: `Onboard agent: ${sanitizedName}`,
        },
      }),
    });

    const patchData = await patchRes.json();

    if (patchData.error) {
      console.error("Config patch failed:", patchData.error);
      return NextResponse.json(
        { error: patchData.error.message || "Failed to patch config" },
        { status: 500 }
      );
    }

    // Optionally, create the workspace directory with starter files
    // This would require additional server-side setup or a separate endpoint
    // For now, we rely on OpenClaw creating it on first message

    return NextResponse.json({
      success: true,
      agentId: sanitizedName,
      message: `Agent ${sanitizedName} created successfully`,
    });
  } catch (err) {
    console.error("Onboard error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
