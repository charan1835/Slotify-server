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

// Send Booking Confirmation Email
export const sendBookingConfirmationEmail = async (email, { bookingId, userName, eventDate, amount, vendorName }) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Slotify" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Booking Confirmed! 🎉',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%); color: white; padding: 40px; text-align: center; border-radius: 16px 16px 0 0; }
                        .content { background: #ffffff; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #e2e8f0; border-top: none; }
                        .details-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0; }
                        .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 10px; }
                        .detail-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
                        .label { color: #64748b; font-size: 14px; }
                        .value { font-weight: 600; color: #0f172a; }
                        .footer { text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px; }
                        .button { display: inline-block; background: #0f172a; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin: 0; font-size: 28px;">Booking Confirmed!</h1>
                            <p style="margin: 10px 0 0 0; opacity: 0.9;">You're all set for your event</p>
                        </div>
                        <div class="content">
                            <p style="font-size: 16px;">Hello <strong>${userName}</strong>,</p>
                            <p>Great news! Your booking with <strong>${vendorName}</strong> has been successfully confirmed.</p>
                            
                            <div class="details-box">
                                <div class="detail-row">
                                    <span class="label">Booking ID</span>
                                    <span class="value">#${bookingId.toString().slice(-6).toUpperCase()}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">Vendor</span>
                                    <span class="value">${vendorName}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">Event Date</span>
                                    <span class="value">${new Date(eventDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">Amount Paid</span>
                                    <span class="value">₹${amount}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="label">Status</span>
                                    <span class="value" style="color: #16a34a;">Confirmed ✅</span>
                                </div>
                            </div>
                            
                            <p>We've notified the vendor about your booking. They will be in touch shortly to discuss further details.</p>
                            
                            <div style="text-align: center;">
                                <a href="https://slotify-client.vercel.app/my-bookings" class="button">View My Bookings</a>
                            </div>

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
        console.log(`✅ Booking Email sent to ${email}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Booking Email sending failed:', error);
        return { success: false, error: error.message };
    }
};

// Send Booking Status Update Email
export const sendBookingStatusUpdateEmail = async (email, { bookingId, userName, eventDate, vendorName, status, notes }) => {
    try {
        const transporter = createTransporter();

        const statusColors = {
            confirmed: '#16a34a', // Green
            rejected: '#dc2626',  // Red
            pending: '#ca8a04',   // Yellow
            cancelled: '#dc2626'  // Red
        };

        const statusColor = statusColors[status.toLowerCase()] || '#0f172a';
        const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);

        const mailOptions = {
            from: `"Slotify" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Update on your Booking: ${formattedStatus}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #0f172a 0%, #334155 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
                        .content { background: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none; }
                        .status-badge { display: inline-block; padding: 8px 16px; border-radius: 50px; color: white; background-color: ${statusColor}; font-weight: bold; margin: 10px 0; }
                        .details-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #94a3b8; font-size: 12px; }
                        .button { display: inline-block; background: #0f172a; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; margin-top: 15px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin: 0; font-size: 24px;">Booking Update</h1>
                        </div>
                        <div class="content">
                            <p>Hello <strong>${userName}</strong>,</p>
                            <p>The status of your booking with <strong>${vendorName}</strong> has been updated.</p>
                            
                            <div style="text-align: center;">
                                <span class="status-badge">${formattedStatus}</span>
                            </div>

                            <div class="details-box">
                                <p style="margin: 5px 0;"><strong>Booking ID:</strong> #${bookingId.toString().slice(-6).toUpperCase()}</p>
                                <p style="margin: 5px 0;"><strong>Event Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
                                ${notes ? `<p style="margin: 5px 0;"><strong>Note:</strong> ${notes}</p>` : ''}
                            </div>
                            
                            <p>If you have any questions, please contact our support team.</p>

                            <div style="text-align: center;">
                                <a href="https://slotify-client.vercel.app/my-bookings" class="button">View Booking details</a>
                            </div>

                            <div class="footer">
                                <p>© 2026 Slotify. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Status Update Email sent to ${email}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Status Update Email sending failed:', error);
        return { success: false, error: error.message };
    }
};

