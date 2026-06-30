import nodemailer from 'nodemailer';

// ─── Gmail Transporter (uses App Password for security) ─────────────────────
// Requires GMAIL_USER and GMAIL_APP_PASSWORD in .env
// Generate an App Password at: https://myaccount.google.com/apppasswords
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,  // App Password, NOT your Gmail password
    },
});

// Verify transporter connection on startup
transporter.verify()
    .then(() => console.log('📧 Email service ready'))
    .catch((err) => console.error('📧 Email service error:', err.message));


// ─── Helper: send an email ──────────────────────────────────────────────────
async function sendMail({ to, subject, html }) {
    try {
        const info = await transporter.sendMail({
            from: `"CPMS - Campus Placement" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`📧 Email sent to ${to} — messageId: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`📧 Failed to send email to ${to}:`, error.message);
        // Don't throw — email failure should not break the main flow
        return null;
    }
}


// ─── 1. Student selected by recruiter → notify the student ─────────────────
async function sendStudentSelectedEmail({ studentEmail, studentName, recruiterName, selectionRole, ctc }) {
    const subject = '🎉 You have been selected by a recruiter!';
    const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Campus Placement Management</h1>
            </div>
            <div style="padding: 30px;">
                <h2 style="color: #333;">Congratulations, ${studentName}! 🎉</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.6;">
                    You have been <strong>selected</strong> by a recruiter. Here are the details:
                </p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #777; width: 40%;">Recruiter</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #333; font-weight: 600;">${recruiterName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #777;">Role</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #333; font-weight: 600;">${selectionRole}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #777;">CTC Offered</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #333; font-weight: 600;">₹${ctc} LPA</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; color: #777;">Status</td>
                        <td style="padding: 12px;"><span style="background: #fff3cd; color: #856404; padding: 4px 12px; border-radius: 12px; font-size: 13px;">Pending Admin Approval</span></td>
                    </tr>
                </table>
                <p style="color: #555; font-size: 14px; line-height: 1.6;">
                    Your selection is currently <strong>pending admin approval</strong>. You will receive another email once the admin reviews and approves your placement.
                </p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center;">
                <p style="color: #999; font-size: 12px; margin: 0;">This is an automated notification from the Campus Placement Management System.</p>
            </div>
        </div>
    `;

    return sendMail({ to: studentEmail, subject, html });
}


// ─── 2. Admin approves selection → notify the student ───────────────────────
async function sendStudentApprovedEmail({ studentEmail, studentName, recruiterName, selectionRole, ctc }) {
    const subject = '✅ Your placement has been approved!';
    const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Campus Placement Management</h1>
            </div>
            <div style="padding: 30px;">
                <h2 style="color: #333;">Great News, ${studentName}! ✅</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.6;">
                    Your placement has been <strong>officially approved</strong> by the admin. Here are your placement details:
                </p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #777; width: 40%;">Company / Recruiter</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #333; font-weight: 600;">${recruiterName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #777;">Role</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #333; font-weight: 600;">${selectionRole}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #777;">CTC Offered</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #333; font-weight: 600;">₹${ctc} LPA</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; color: #777;">Status</td>
                        <td style="padding: 12px;"><span style="background: #d4edda; color: #155724; padding: 4px 12px; border-radius: 12px; font-size: 13px;">Approved ✓</span></td>
                    </tr>
                </table>
                <p style="color: #555; font-size: 14px; line-height: 1.6;">
                    Congratulations on your placement! Please contact your placement cell for the next steps.
                </p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center;">
                <p style="color: #999; font-size: 12px; margin: 0;">This is an automated notification from the Campus Placement Management System.</p>
            </div>
        </div>
    `;

    return sendMail({ to: studentEmail, subject, html });
}


// ─── 3. Admin approves selection → notify the recruiter ─────────────────────
async function sendRecruiterApprovalEmail({ recruiterEmail, recruiterName, studentName, selectionRole, ctc }) {
    const subject = '✅ Your student selection has been approved!';
    const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Campus Placement Management</h1>
            </div>
            <div style="padding: 30px;">
                <h2 style="color: #333;">Hello, ${recruiterName}!</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.6;">
                    Your student selection has been <strong>approved</strong> by the admin. Here are the details:
                </p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #777; width: 40%;">Student</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #333; font-weight: 600;">${studentName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #777;">Role</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #333; font-weight: 600;">${selectionRole}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #777;">CTC</td>
                        <td style="padding: 12px; border-bottom: 1px solid #eee; color: #333; font-weight: 600;">₹${ctc} LPA</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; color: #777;">Status</td>
                        <td style="padding: 12px;"><span style="background: #d4edda; color: #155724; padding: 4px 12px; border-radius: 12px; font-size: 13px;">Approved ✓</span></td>
                    </tr>
                </table>
                <p style="color: #555; font-size: 14px; line-height: 1.6;">
                    You may now proceed with the onboarding process for this student.
                </p>
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center;">
                <p style="color: #999; font-size: 12px; margin: 0;">This is an automated notification from the Campus Placement Management System.</p>
            </div>
        </div>
    `;

    return sendMail({ to: recruiterEmail, subject, html });
}


export {
    sendStudentSelectedEmail,
    sendStudentApprovedEmail,
    sendRecruiterApprovalEmail,
};
