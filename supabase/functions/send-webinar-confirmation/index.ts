
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WebinarRegistrationRequest {
  name: string;
  email: string;
  webinarTitle: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, webinarTitle }: WebinarRegistrationRequest = await req.json();
    
    console.log(`Processing webinar registration for ${name} (${email}) - ${webinarTitle}`);

    const emailResponse = await resend.emails.send({
      from: "Inventory System <onboarding@resend.dev>",
      to: [email],
      subject: `Webinar Registration Confirmation: ${webinarTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">Webinar Registration Confirmation</h1>
          <p>Hello ${name},</p>
          <p>Thank you for registering for our upcoming webinar:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #2563eb; margin-top: 0;">${webinarTitle}</h2>
          </div>
          <p>You will receive a calendar invitation and connection details closer to the scheduled date.</p>
          <p>If you have any questions or need to make changes to your registration, please contact our support team.</p>
          <p style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 14px; color: #666;">
            Best regards,<br>
            The STOCKtopus Training Team
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-webinar-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
