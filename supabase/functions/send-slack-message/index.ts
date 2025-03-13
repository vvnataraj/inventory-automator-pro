
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// The Slack channel webhook URL
const SLACK_WEBHOOK_URL = "https://join.slack.com/share/enQtODU3OTQ0OTUxNDAwNy04MmNhNTkyOTVmZjQ0ZmRlOGI3Yjg3NDQ5M2QxYzE5NWZmZTRkZmE4ZGQ5YTM5NGQ3ZWQ1NmFkZTgwMzdiNzQ2";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sender, timestamp, channel } = await req.json();

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

    // If a specific channel is provided, add it to the payload
    if (channel) {
      slackPayload.channel = channel;
    }

    // Send the message to Slack
    const slackResponse = await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(slackPayload)
    });

    if (!slackResponse.ok) {
      const errorText = await slackResponse.text();
      console.error("Slack error response:", errorText);
      
      // Check for common private channel errors
      if (errorText.includes("channel_not_found") || errorText.includes("not_in_channel")) {
        throw new Error("Unable to send message to private channel. Make sure the Slack app is invited to this channel.");
      } else {
        throw new Error(`Failed to send to Slack: ${slackResponse.statusText}`);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending message to Slack:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        hint: error.message.includes("private channel") 
          ? "To send messages to a private Slack channel, invite the Slack app to that channel first"
          : undefined
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
