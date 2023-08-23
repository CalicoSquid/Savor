import axios from 'axios';

export async function sendErrorEmail(userEmail, error, baseURL, url) {

  const emailSubject = 'Error Report';
  const fromEmail = 'calicosquidcode@gmail.com';
  const toEmail = 'calicosquidcode@gmail.com';
  const emailContent = `Error report from user ${userEmail}:\n\n${error}\n\n URL:\n\n${url}`;

  const emailData = {
    subject: emailSubject,
    from: fromEmail,
    to: toEmail,
    html: emailContent, // Use the 'html' field for plain text content in this case
  };

  try {
    await axios.post(`${baseURL}/send-email`, emailData);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

/////

export async function sendRecoverEmail(userEmail, stateProps) {
  const {baseURL, setErrorMessage, setSuccessMessage} = stateProps;
  const emailSubject = 'Savor Password Recovery';
  const fromEmail = 'calicosquidcode@gmail.com';
  const emailContent = `Click the link to recover your password: ${baseURL}/reset-password?email=${userEmail}`;

  const emailData = {
    subject: emailSubject,
    from: fromEmail,
    to: userEmail,
    html: emailContent,
  };

  try {
    await axios.post(`${baseURL}/recover-password`,{ emailData, userEmail});
    console.log('Recovery email sent successfully');
    setSuccessMessage(prev => ({
      ...prev,
      login: "Email sent. Check your inbox."
  }))
  } catch (error) {
    console.error('Error sending recovery email:', error);
    setErrorMessage(prevError => ({
      ...prevError,
      login: {
        message: "Failed to update password",
        err: error?.message
      }
    }))
  }
}
//////

export async function sendWelcomeEmail(userEmail, userName, baseURL) {
    try {
      const response = await axios.post(`${baseURL}/send-welcome-email`, {
        userEmail,
        userName,
      });
      console.log('Welcome email sent successfully:', response.data.message);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }