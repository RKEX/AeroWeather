import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email: must include "@" and not be empty
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: "AeroWeather <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to AeroWeather 🌩️",
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #020617; margin: 0; padding: 60px 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
              <div style="padding: 48px 40px; color: #f8fafc;">
                <div style="margin-bottom: 40px;">
                  <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.025em; margin: 0;">AeroWeather</h1>
                </div>

                <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 24px;">Hey,</p>

                <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 24px;">
                  I'm <strong>Rick Das</strong> — CEO of AeroWeather.
                </p>

                <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 24px;">
                  I started AeroWeather because most weather apps are cluttered and noisy. I wanted to build something clean, fast, and actually useful — where data speaks clearly and helps you make better decisions.
                </p>

                <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 12px;">
                  Now that you're in, here are a few things you can explore:
                </p>
                
                <ul style="padding-left: 20px; color: #94a3b8; font-size: 15px; line-height: 2; margin-bottom: 32px;">
                  <li style="margin-bottom: 4px;"><span style="color: #ffffff;">Your real-time weather dashboard</span></li>
                  <li style="margin-bottom: 4px;"><span style="color: #ffffff;">Advanced weather intelligence insights</span></li>
                  <li style="margin-bottom: 4px;"><span style="color: #ffffff;">Hyper-local forecasts designed for accuracy</span></li>
                </ul>

                <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 24px;">
                  Quick question — what made you join AeroWeather?
                </p>

                <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 40px;">
                  Just hit reply and tell me. I read every message.
                </p>

                <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 32px;">
                  <p style="font-size: 16px; line-height: 1.2; color: #ffffff; margin: 0 0 4px 0;">Welcome aboard 🌩️</p>
                  <p style="font-size: 16px; font-weight: 700; color: #ffffff; margin: 0 0 4px 0;">Rick Das</p>
                  <p style="font-size: 13px; font-weight: 600; color: #64748b; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">CEO, AeroWeather</p>
                </div>
              </div>
              
              <div style="background-color: rgba(255,255,255,0.02); padding: 32px 40px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
                 <p style="margin: 0; font-size: 11px; color: #475569; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">
                  Sent with Precision from AeroWeather HQ
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error: "Failed to send subscription email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Internal Server Error (Subscribe):", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
