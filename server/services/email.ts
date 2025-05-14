import { Resend } from "resend";

// Initialize Resend with API key
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.warn("Missing RESEND_API_KEY environment variable");
}

const resend = new Resend(resendApiKey);

// Admin email to receive notifications
const ADMIN_EMAIL = "admin@historybeyondheadlines.com"; // Replace with actual admin email

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    if (!resendApiKey) {
      console.warn("Skipping email sending - No Resend API key");
      return { success: true, id: "mock-email-id" };
    }
    
    // Create HTML email content
    const html = `
      <h1>New Contact Form Message</h1>
      <p><strong>From:</strong> ${data.name} (${data.email})</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
      <hr />
      <p><em>This email was sent from the History Beyond Headlines contact form.</em></p>
    `;
    
    // Send the email using Resend
    const { data: emailData, error } = await resend.emails.send({
      from: "Contact Form <contact@historybeyondheadlines.com>",
      to: [ADMIN_EMAIL],
      subject: `New Contact Form Message: ${data.subject}`,
      html,
      replyTo: data.email,
    });
    
    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
    
    return { success: true, id: emailData?.id };
  } catch (error) {
    console.error("Error sending contact email:", error);
    throw error;
  }
}