import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Send OTP Email
export const sendOtpEmail = async (email, otp) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Slotify" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Slotify Login OTP',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                        .otp-box { background: white; border: 2px solid #0f172a; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                        .otp-code { font-size: 32px; font-weight: bold; color: #0f172a; letter-spacing: 8px; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin: 0;">🎉 Slotify</h1>
                            <p style="margin: 10px 0 0 0;">Your Event Booking Platform</p>
                        </div>
                        <div class="content">
                            <h2 style="color: #0f172a;">Login Verification</h2>
                            <p>Hello!</p>
                            <p>You requested to login to your Slotify account. Use the OTP code below to complete your login:</p>
                            
                            <div class="otp-box">
                                <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
                                <div class="otp-code">${otp}</div>
                                <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">Valid for 5 minutes</p>
                            </div>
                            
                            <p><strong>⚠️ Security Tips:</strong></p>
                            <ul style="color: #666; font-size: 14px;">
                                <li>Never share this OTP with anyone</li>
                                <li>Slotify will never ask for your OTP via email or phone</li>
                                <li>If you didn't request this, please ignore this email</li>
                            </ul>
                            
                            <div class="footer">
                                <p>© 2026 Slotify. All rights reserved.</p>
                                <p>This is an automated message, please do not reply to this email.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully to ${email}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email sending failed:', error);
        // Fallback: Log OTP to console if email fails
        console.log(`🔐 FALLBACK - OTP for ${email}: ${otp}`);
        return { success: false, error: error.message };
    }
};
