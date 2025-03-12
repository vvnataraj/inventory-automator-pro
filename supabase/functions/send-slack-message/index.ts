
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// The Slack channel webhook URL would typically be stored as a secret
const SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/YOUR_WEBHOOK_PATH";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sender, timestamp } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format the message for Slack
    const slackPayload = {
      text: "New message from STOCKtopus app:",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*New message from ${sender || "Anonymous User"}*\n${message}`
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "plain_text",
              text: `Sent at ${new Date(timestamp).toLocaleString()}`
            }
          ]
        }
      ]
    };

    // Send the message to Slack
    const slackResponse = await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(slackPayload)
    });

    if (!slackResponse.ok) {
      throw new Error(`Failed to send to Slack: ${slackResponse.statusText}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending message to Slack:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
