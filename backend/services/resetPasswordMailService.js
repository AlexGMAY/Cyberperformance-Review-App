const postmark = require("postmark");

// Initialize the Postmark client with your Server API Key
const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

/**
 * Send a password reset email using Postmark
 * @param {string} email - Recipient's email address
 * @param {string} resetToken - Password reset token
 */
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;

    await client.sendEmail({
      From: process.env.EMAIL_USER, // Your verified sender email in Postmark
      To: email,
      Subject: "Password Reset Request",
      HtmlBody: `
        <p>You have requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link is valid for 1 hour.</p>
      `,
      MessageStream: "outbound", // Use default message stream
    });

    console.log(`Password reset email sent to: ${email}`);
  } catch (error) {
    console.error(`Error sending reset email to: ${email}`, error.message);
    throw new Error("Failed to send reset email.");
  }
};

module.exports = { sendPasswordResetEmail };
