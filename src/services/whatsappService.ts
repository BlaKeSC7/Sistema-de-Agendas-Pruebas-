interface WhatsAppMessageData {
  clientPhone: string;
  clientName: string;
  date: string;
  time: string;
  service: string;
}

const ADMIN_PHONE = '+18092033894';

// Variable para evitar ejecuciones múltiples
let isExecuting = false;

// Función para abrir WhatsApp directamente sin confirmación
export const openWhatsAppWithMessage = (phone: string, message: string) => {
  // Prevenir ejecuciones múltiples
  if (isExecuting) return;
  isExecuting = true;
  
  // Reset después de un tiempo
  setTimeout(() => { isExecuting = false; }, 2000);
  
  // Limpiar el número de teléfono
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Codificar el mensaje para URL
  const encodedMessage = encodeURIComponent(message);
  
  // Detectar el dispositivo
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isMobile = isIOS || isAndroid;
  
  if (isMobile) {
    // Método 1: Usar window.location.href (mejor para iOS)
    window.location.href = `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`;
  } else {
    // Para navegadores de escritorio
    window.open(`https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
  }
};

// Función alternativa si la principal no funciona
export const openWhatsAppAlternative = (phone: string, message: string) => {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  
  if (isIOS || isAndroid) {
    // Método alternativo: crear enlace y hacer click inmediato SIN setTimeout
    const a = document.createElement('a');
    a.href = `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`;
    a.target = '_self';
    
    // Click inmediato - SIN setTimeout
    a.click();
  } else {
    window.open(`https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`, '_blank');
  }
};

export const notifyAppointmentCreated = (data: WhatsAppMessageData) => {
  const adminMessage = `🔔 *NUEVA CITA REGISTRADA* 🔔

✂️ *D' Gastón Stylo Barbería*

👤 *Cliente:* ${data.clientName}
📱 *Teléfono:* ${data.clientPhone}
📅 *Fecha:* ${data.date}
🕒 *Hora:* ${data.time}
💼 *Servicio:* ${data.service}

¡Nueva cita confirmada en el sistema!`;

  try {
    // Solo enviar mensaje al admin/dueño
    openWhatsAppWithMessage(ADMIN_PHONE, adminMessage);
    
    return { success: true };
  } catch (error) {
    console.error('Error abriendo WhatsApp:', error);
    // Intentar método alternativo
    try {
      openWhatsAppAlternative(ADMIN_PHONE, adminMessage);
      return { success: true };
    } catch (altError) {
      console.error('Error con método alternativo:', altError);
      throw error;
    }
  }
};

export const notifyAppointmentCancelled = (data: WhatsAppMessageData) => {
  const adminMessage = `❌ *CITA CANCELADA* ❌

✂️ *D' Gastón Stylo Barbería*

👤 *Cliente:* ${data.clientName}
📱 *Teléfono:* ${data.clientPhone}
📅 *Fecha:* ${data.date}
🕒 *Hora:* ${data.time}
💼 *Servicio:* ${data.service}

⚠️ *El horario está ahora disponible para nuevas citas.*`;

  try {
    // Solo enviar mensaje al admin/dueño
    openWhatsAppWithMessage(ADMIN_PHONE, adminMessage);
    
    return { success: true };
  } catch (error) {
    console.error('Error abriendo WhatsApp:', error);
    // Intentar método alternativo
    try {
      openWhatsAppAlternative(ADMIN_PHONE, adminMessage);
      return { success: true };
    } catch (altError) {
      console.error('Error con método alternativo:', altError);
      throw error;
    }
  }
};

// Función para notificar al cliente sobre su cita confirmada
export const notifyClientAppointmentConfirmed = (data: WhatsAppMessageData) => {
  const clientMessage = `✅ *CITA CONFIRMADA* ✅

✂️ *D' Gastón Stylo Barbería*

¡Hola ${data.clientName}! Tu cita ha sido confirmada:

📅 *Fecha:* ${data.date}
🕒 *Hora:* ${data.time}
💼 *Servicio:* ${data.service}

📍 *Dirección:* [Tu dirección aquí]

⏰ Te recomendamos llegar 5 minutos antes.

¡Nos vemos pronto! 💈`;

  try {
    openWhatsAppWithMessage(data.clientPhone, clientMessage);
    return { success: true };
  } catch (error) {
    console.error('Error abriendo WhatsApp:', error);
    try {
      openWhatsAppAlternative(data.clientPhone, clientMessage);
      return { success: true };
    } catch (altError) {
      console.error('Error con método alternativo:', altError);
      throw error;
    }
  }
};

// Función para notificar al cliente sobre cancelación
export const notifyClientAppointmentCancelled = (data: WhatsAppMessageData) => {
  const clientMessage = `❌ *CITA CANCELADA* ❌

✂️ *D' Gastón Stylo Barbería*

Hola ${data.clientName}, 

Tu cita programada para:
📅 *Fecha:* ${data.date}
🕒 *Hora:* ${data.time}
💼 *Servicio:* ${data.service}

Ha sido cancelada.

💬 Si deseas reagendar, no dudes en contactarnos.

¡Gracias por tu comprensión! 🙏`;

  try {
    openWhatsAppWithMessage(data.clientPhone, clientMessage);
    return { success: true };
  } catch (error) {
    console.error('Error abriendo WhatsApp:', error);
    try {
      openWhatsAppAlternative(data.clientPhone, clientMessage);
      return { success: true };
    } catch (altError) {
      console.error('Error con método alternativo:', altError);
      throw error;
    }
  }
};