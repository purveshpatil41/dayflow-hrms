import sendEmail from './utils/sendEmail.js';
import dotenv from 'dotenv';

dotenv.config();

const testEmail = async () => {
  try {
    console.log('Testing email configuration...');
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***configured***' : 'NOT SET');

    const testMessage = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 30px; border-radius: 10px; }
          h1 { color: #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Test Email from Dayflow HRMS</h1>
          <p>This is a test email to verify email configuration is working.</p>
          <p>If you receive this, email sending is configured correctly!</p>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      email: 'ashokkrsah19@gmail.com', // Replace with your test email
      subject: 'Test Email from Dayflow HRMS',
      message: testMessage,
    });

    console.log('\n✅ Test email sent successfully!');
    console.log('Check your inbox at: ashokkrsah19@gmail.com');
  } catch (error) {
    console.error('\n❌ Email sending failed!');
    console.error('Error:', error.message);
    console.error('Full error:', error);
  }
};

testEmail();
