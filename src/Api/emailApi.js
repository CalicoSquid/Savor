import axios from "axios";

const apiKey = '47F473F2837568D9723E40063FCAF05121E41C1360DF8D1AB13E695B174D710E73B82AB6C3605C579CA0D8BABD495497';
const baseUrl = 'https://api.elasticemail.com/v2';


export async function sendEmail(userEmail, error) {
    console.log("sending")
    const emailData = {
      subject: 'Savor the Flavor',
      from: userEmail,
      to: 'calicosquidcode@gmail.com',
      bodyHtml: `<p>This is the HTML content of the email.</p>`,
    };
  
    try {
      const response = await axios.post(`${baseUrl}/email/send`, emailData, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': apiKey,
        },
      });
      console.log(response)
      //console.log('Email sent successfully:', response.data);
    } catch (error) {
        console.log("ERROR")
      //console.error('Error sending email:', error.response.data);
    }
  }
  
