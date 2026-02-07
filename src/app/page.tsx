"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Icons as components
const BotIcon = () => (
  <svg
    className="w-12 h-12"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="8"
      y="12"
      width="32"
      height="28"
      rx="4"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="18" cy="24" r="3" fill="currentColor" />
    <circle cx="30" cy="24" r="3" fill="currentColor" />
    <path
      d="M18 32h12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M24 12V6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="24" cy="4" r="2" fill="currentColor" />
    <path
      d="M4 24h4M40 24h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const SlackIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

type Step = "connect" | "configure" | "complete";

function OnboardingContent() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("connect");
  const [agentName, setAgentName] = useState("");
  const [slackUserId, setSlackUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slackData, setSlackData] = useState<{
    botToken: string;
    appToken: string;
    teamName: string;
    userId: string;
  } | null>(null);

  // Check for OAuth callback or demo mode
  useEffect(() => {
    const code = searchParams.get("code");
    const slackError = searchParams.get("error");
    const demoStep = searchParams.get("demo");

    // Demo mode for previewing steps
    if (demoStep === "configure") {
      setSlackData({
        botToken: "demo",
        appToken: "demo",
        teamName: "Acme Corp",
        userId: "U0123456789",
      });
      setSlackUserId("U0123456789");
      setStep("configure");
      return;
    }
    if (demoStep === "complete") {
      setAgentName("acme-bot");
      setStep("complete");
      return;
    }

    if (slackError) {
      setError(`Slack authorization failed: ${slackError}`);
      return;
    }

    if (code) {
      // Exchange code for tokens
      exchangeCodeForTokens(code);
    }
  }, [searchParams]);

  const exchangeCodeForTokens = async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/slack/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to exchange tokens");

      setSlackData(data);
      setSlackUserId(data.userId);
      setStep("configure");
      
      // Clear URL params
      window.history.replaceState({}, "", "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect Slack");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlackConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_SLACK_CLIENT_ID;
    
    if (!clientId) {
      const errorMsg = "Slack Client ID not configured. Please set NEXT_PUBLIC_SLACK_CLIENT_ID environment variable and redeploy.";
      console.error(errorMsg);
      setError(errorMsg);
      return;
    }

    const scopes = encodeURIComponent(
      "app_mentions:read,channels:history,channels:read,chat:write,groups:history,groups:read,im:history,im:read,im:write,mpim:history,mpim:read,users:read"
    );

    // Let Slack use the default redirect URL configured in the app
    const authUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopes}`;
    console.log("Redirecting to:", authUrl);
    window.location.href = authUrl;
  };

  const handleCreateAgent = async () => {
    if (!agentName.trim() || !slackUserId.trim() || !slackData) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName: agentName.trim().toLowerCase().replace(/\s+/g, "-"),
          slackUserId: slackUserId.trim(),
          botToken: slackData.botToken,
          appToken: slackData.appToken,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create agent");

      setStep("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create agent");
    } finally {
      setIsLoading(false);
    }
  };

  const validateAgentName = (name: string) => {
    return /^[a-z0-9-]+$/.test(name.toLowerCase().replace(/\s+/g, "-"));
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-giga-800/60 border border-giga-600/30 text-giga-500 mb-6 shadow-glow-sm">
            <BotIcon />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-wide mb-3 glow-text">
            AGENT ONBOARD
          </h1>
          <p className="text-gray-400 text-lg">
            Create your personal AI assistant
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-3 mb-8 animate-slide-up">
          {(["connect", "configure", "complete"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  step === s
                    ? "bg-giga-500 text-giga-900 shadow-glow-sm"
                    : i < ["connect", "configure", "complete"].indexOf(step)
                    ? "bg-giga-600 text-white"
                    : "bg-giga-800 text-gray-500 border border-giga-700/50"
                }`}
              >
                {i < ["connect", "configure", "complete"].indexOf(step) ? (
                  <CheckIcon />
                ) : (
                  i + 1
                )}
              </div>
              {i < 2 && (
                <div
                  className={`w-12 h-0.5 transition-all duration-300 ${
                    i < ["connect", "configure", "complete"].indexOf(step)
                      ? "bg-giga-500"
                      : "bg-giga-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div
          className="card animated-border animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-giga-accent-red/10 border border-giga-accent-red/30 text-giga-accent-red">
              {error}
            </div>
          )}

          {/* Step 1: Connect Slack */}
          {step === "connect" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="font-display text-xl font-semibold mb-2">
                  Connect Your Slack
                </h2>
                <p className="text-gray-400 text-sm">
                  Install the bot to your Slack workspace to enable DM access
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  console.log("Button clicked - calling handleSlackConnect");
                  handleSlackConnect();
                }}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-semibold text-white bg-[#4A154B] hover:bg-[#5a1a5c] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <SpinnerIcon />
                ) : (
                  <>
                    <SlackIcon />
                    Add to Slack
                  </>
                )}
              </button>

              <div className="text-center text-gray-500 text-xs">
                Your tokens are stored securely and only used to route messages
              </div>
            </div>
          )}

          {/* Step 2: Configure Agent */}
          {step === "configure" && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="font-display text-xl font-semibold mb-2">
                  Configure Your Agent
                </h2>
                <p className="text-gray-400 text-sm">
                  {slackData?.teamName && (
                    <span className="text-giga-500">{slackData.teamName}</span>
                  )}{" "}
                  connected! Now name your assistant.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="my-assistant"
                    className="input-field font-mono"
                    autoFocus
                  />
                  {agentName && !validateAgentName(agentName) && (
                    <p className="mt-1 text-xs text-giga-accent-orange">
                      Only lowercase letters, numbers, and hyphens allowed
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Slack User ID
                  </label>
                  <input
                    type="text"
                    value={slackUserId}
                    onChange={(e) => setSlackUserId(e.target.value)}
                    placeholder="U0123456789"
                    className="input-field font-mono"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Find this in Slack: Profile → ⋯ → Copy member ID
                  </p>
                </div>
              </div>

              <button
                onClick={handleCreateAgent}
                disabled={
                  isLoading ||
                  !agentName.trim() ||
                  !slackUserId.trim() ||
                  !validateAgentName(agentName)
                }
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <SpinnerIcon />
                    Creating...
                  </>
                ) : (
                  "Create My Agent"
                )}
              </button>
            </div>
          )}

          {/* Step 3: Complete */}
          {step === "complete" && (
            <div className="space-y-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-giga-accent-green/20 text-giga-accent-green">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold mb-2">
                  You&apos;re All Set!
                </h2>
                <p className="text-gray-400">
                  Your agent{" "}
                  <span className="text-giga-500 font-mono">{agentName}</span> is
                  now live.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-giga-900/60 border border-giga-700/30 text-left">
                <p className="text-sm text-gray-300 mb-2">Next steps:</p>
                <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
                  <li>Open Slack and find your bot in DMs</li>
                  <li>Send a message to start chatting</li>
                  <li>Customize your agent&apos;s SOUL.md in the workspace</li>
                </ol>
              </div>

              <a href="/" className="btn-secondary inline-flex">
                Create Another Agent
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm animate-fade-in">
          Powered by{" "}
          <a
            href="https://openclaw.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-giga-600 hover:text-giga-500 transition-colors"
          >
            OpenClaw
          </a>
        </div>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-giga-500">Loading...</div>
      </main>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
