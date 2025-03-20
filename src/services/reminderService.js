/**
 * ReminderService - Muistutusten hallinta- ja lähetyspalvelu
 * 
 * Tämä palvelu käsittelee muistutusten tallennuksen, haun ja lähetyksen.
 * Palvelu on suunniteltu niin, että tietokantayhteyden lisääminen on helppoa.
 * Tällä hetkellä käytetään local storagea, mutta tietokantayhteyden lisääminen
 * onnistuu vaihtamalla metodien toteutus.
 */

import { send as sendEmail } from './emailService';

// Tämä on väliaikainen toteutus local storagella
// Kun tietokanta lisätään, tämä vaihdetaan tietokantakutsulla
const getReminders = () => {
  return JSON.parse(localStorage.getItem('reminders') || '[]');
};

const saveReminders = (reminders) => {
  localStorage.setItem('reminders', JSON.stringify(reminders));
};

// Tämä on väliaikainen toteutus
// Kun tietokanta lisätään, tämä vaihdetaan tietokantakutsulla
const addReminder = (reminder) => {
  const reminders = getReminders();
  reminders.push(reminder);
  saveReminders(reminders);
  return reminder;
};

// Tämä on väliaikainen toteutus
// Kun tietokanta lisätään, tämä vaihdetaan tietokantakutsulla
const deleteReminder = (reminderId) => {
  const reminders = getReminders();
  const updatedReminders = reminders.filter(r => r.eventId !== reminderId);
  saveReminders(updatedReminders);
};

// Tämä on väliaikainen toteutus
// Kun tietokanta lisätään, tämä vaihdetaan tietokantakutsulla
const getRemindersByEmail = (email) => {
  const reminders = getReminders();
  return reminders.filter(r => r.email === email);
};

// Tämä on väliaikainen toteutus
// Kun tietokanta lisätään, tämä vaihdetaan tietokantakutsulla
const getRemindersByEventId = (eventId) => {
  const reminders = getReminders();
  return reminders.filter(r => r.eventId === eventId);
};

// Tarkistaa muistutukset ja lähettää sähköpostit
const checkAndSendReminders = async () => {
  const reminders = getReminders();
  const now = new Date();
  
  for (const reminder of reminders) {
    const reminderDateTime = new Date(reminder.reminderDateTime);
    
    // Jos muistutusaika on nyt, lähetä sähköposti
    if (reminderDateTime <= now) {
      try {
        await sendReminderEmail(reminder);
        // Poista lähetetty muistutus
        deleteReminder(reminder.eventId);
      } catch (error) {
        console.error('Virhe muistutuksen lähetyksessä:', error);
      }
    }
  }
};

// Lähettää muistutussähköpostin
const sendReminderEmail = async (reminder) => {
  const subject = `Muistutus: ${reminder.eventName}`;
  const text = `Muistutus tapahtumasta "${reminder.eventName}" ${new Date(reminder.eventDate).toLocaleDateString('fi-FI')}.`;
  
  await sendEmail({
    to: reminder.email,
    subject,
    text
  });
};

// Käynnistää muistutusten tarkistuksen
const startReminderCheck = () => {
  // Tarkista muistutukset minuutin välein
  const checkInterval = 60 * 1000;
  
  // Tarkista heti käynnistyksessä
  checkAndSendReminders();
  
  // Aseta minuutittainen tarkistus
  setInterval(checkAndSendReminders, checkInterval);
};

export {
  getReminders,
  addReminder,
  deleteReminder,
  getRemindersByEmail,
  getRemindersByEventId,
  startReminderCheck
}; 