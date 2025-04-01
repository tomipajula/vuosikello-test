/**
 * ReminderService - Muistutusten hallinta- ja lähetyspalvelu
 * 
 * Tämä palvelu käsittelee muistutusten tallennuksen, haun ja lähetyksen.
 * Palvelu käyttää Cosmos DB:tä tietojen tallentamiseen.
 */

import { send as sendEmail } from './emailService';
import jp from './cosmosDbService';

// Hakee muistutukset tietokannasta
const getReminders = async () => {
  try {
    return await jp.getReminders();
  } catch (error) {
    console.error("Virhe muistutusten haussa:", error);
    return [];
  }
};

// Tallentaa muistutukset tietokantaan
const saveReminders = async (reminders) => {
  try {
    return await jp.saveReminders(reminders);
  } catch (error) {
    console.error("Virhe muistutusten tallennuksessa:", error);
    return reminders; // Palautetaan alkuperäiset muistutukset virheen sattuessa
  }
};

// Lisää uuden muistutuksen
const addReminder = async (reminder) => {
  try {
    // Lisää id-kenttä, jos sitä ei ole
    if (!reminder.id) {
      reminder.id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    }
    
    return await jp.addReminder(reminder);
  } catch (error) {
    console.error("Virhe muistutuksen lisäyksessä:", error);
    return reminder; // Palautetaan alkuperäinen muistutus virheen sattuessa
  }
};

// Poistaa muistutuksen
const deleteReminder = async (eventId) => {
  try {
    const reminders = await getReminders();
    const reminder = reminders.find(r => r.eventId === eventId);
    
    if (reminder) {
      await jp.deleteReminder(reminder.id, eventId);
    }
  } catch (error) {
    console.error(`Virhe muistutuksen poistossa (eventId: ${eventId}):`, error);
  }
};

// Tarkistaa muistutukset ja lähettää sähköpostit
const checkAndSendReminders = async () => {
  const reminders = await getReminders();
  const now = new Date();
  
  for (const reminder of reminders) {
    const reminderDateTime = new Date(reminder.reminderDateTime);
    
    // Jos muistutusaika on nyt, lähetä sähköposti
    if (reminderDateTime <= now) {
      try {
        await sendReminderEmail(reminder);
        // Poista lähetetty muistutus
        await deleteReminder(reminder.eventId);
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

// Muistutusten tarkistuksen käynnistys
const startReminderCheck = () => {
  // Tarkistetaan muistutukset minuutin välein
  setInterval(async () => {
    await checkAndSendReminders();
  }, 60000);
  
  // Tarkistetaan muistutukset heti sovelluksen käynnistyessä
  checkAndSendReminders();
};

export {
  getReminders,
  saveReminders,
  addReminder,
  deleteReminder,
  startReminderCheck
}; 