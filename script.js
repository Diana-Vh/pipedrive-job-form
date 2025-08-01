
const API_TOKEN = "e25d77c4d26978ab3efc9d48a52b369d75574399";
const COMPANY_DOMAIN = "ty-sandbox"; 

// Отображение статуса
function setStatus(message, color = "black") {
  const statusEl = document.getElementById("status");
  statusEl.textContent = message;
  statusEl.style.color = color;
}

// Создаём сделку через Pipedrive API
async function createDeal(data) {
  const dealData = {
    title: `Заявка от ${data.client_name} - ${data.job_type}`,
    person_id: 0, // Можно добавить логику поиска или создания контакта, сейчас 0 - без контакта
    visible_to: "3", // Все пользователи компании
    // Добавим кастомные поля, если есть
    "43f23735a8a7d9a0e3d7": data.client_phone, // Пример ID кастомного поля - Заменить на свои
    "1234567890abcdef": data.client_email, // Пример email, заменить ID на свой
    // Другие поля по API, если нужны
  };

  // основные поля в title, а остальные через заметку

  const response = await fetch(
    `https://${COMPANY_DOMAIN}.pipedrive.com/api/v1/deals?api_token=${API_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dealData),
    }
  );
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || "Ошибка при создании сделки");
  }
  return result.data.id;
}

// заметкf с описанием работы и деталями
async function createNote(dealId, data) {
  const noteContent = `
Телефон: ${data.client_phone}
Email: ${data.client_email}
Источник: ${data.job_source}
Описание: ${data.job_description}
Адрес: ${data.address}, ${data.city}, ${data.state}, ${data.zip}
Дата: ${data.date}
Время: с ${data.start_time} до ${data.end_time}
Техник: ${data.technician}
  `.trim();

  const response = await fetch(
    `https://${COMPANY_DOMAIN}.pipedrive.com/api/v1/notes?api_token=${API_TOKEN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: noteContent,
        deal_id: dealId,
      }),
    }
  );
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || "Ошибка при создании заметки");
  }
  return result.data.id;
}

// Обработка отправки формы
document.getElementById("jobForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const jobData = {
    client_name: form.client_name.value.trim(),
    client_phone: form.client_phone.value.trim(),
    client_email: form.client_email.value.trim(),
    job_type: form.job_type.value.trim(),
    job_source: form.job_source.value.trim(),
    job_description: form.job_description.value.trim(),
    address: form.address.value.trim(),
    city: form.city.value.trim(),
    state: form.state.value.trim(),
    zip: form.zip.value.trim(),
    date: form.date.value,
    start_time: form.start_time.value,
    end_time: form.end_time.value,
    technician: form.technician.value.trim(),
  };

  try {
    document.getElementById("submitBtn").disabled = true;
    setStatus("Создаём сделку...", "blue");

    const dealId = await createDeal(jobData);
    await createNote(dealId, jobData);

    setStatus("Сделка успешно создана! ✅", "green");

    const viewLink = document.getElementById("viewDealLink");
    viewLink.href = `https://${COMPANY_DOMAIN}.pipedrive.com/deal/${dealId}`;
    document.getElementById("links").style.display = "block";
  } catch (error) {
    setStatus("Ошибка: " + error.message, "red");
  } finally {
    document.getElementById("submitBtn").disabled = false;
  }
});
