import mailgun from "mailgun-js";

export const transporter = mailgun({
  apiKey: process.env.MAILGUN_API_KEY as string,
  domain: process.env.MAILGUN_DOMAIN as string,
  endpoint: "https://api.eu.mailgun.net/v3/email.mytinylibrary.com",
});
