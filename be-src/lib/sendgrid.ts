const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function enviarEmail(msg) {
  try {
    await sgMail.send(msg);
    return { response: "Informacion enviada al dueño de la mascota" };
  } catch (error) {
    console.error(error);
  }
}
