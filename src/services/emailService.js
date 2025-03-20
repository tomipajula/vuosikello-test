/**
 * EmailService - Sähköpostien lähetyspalvelu
 * 
 * Tämä palvelu käsittelee sähköpostien lähetyksen.
 * Tällä hetkellä palvelu vain lokittaa lähetykset konsoliin,
 * mutta se on suunniteltu niin, että oikean sähköpostipalvelun
 * (esim. SendGrid, Amazon SES) lisääminen on helppoa.
 */

// Tämä on väliaikainen toteutus
// Kun oikea sähköpostipalvelu lisätään, tämä vaihdetaan oikealla toteutuksella
const send = async ({ to, subject, text }) => {
  // TODO: Implementoi oikea sähköpostipalvelu
  // Esimerkki SendGrid:llä:
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // await sgMail.send({
  //   to,
  //   from: 'noreply@example.com',
  //   subject,
  //   text
  // });

  // Väliaikainen toteutus: lokita konsoliin
  console.log('Lähetetään sähköposti:', {
    to,
    subject,
    text
  });

  // Simuloi lähetyksen viive
  await new Promise(resolve => setTimeout(resolve, 1000));
};

export { send }; 