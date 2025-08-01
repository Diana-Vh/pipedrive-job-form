document.getElementById("submit-btn").addEventListener("click", async () => {
  const jobData = {
    client_name: document.getElementById("client-name").value,
    client_phone: document.getElementById("client-phone").value,
    client_email: document.getElementById("client-email").value,

    job_type: document.getElementById("job-type").value,
    job_source: document.getElementById("job-source").value,
    description: document.getElementById("job-description").value,

    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    zip: document.getElementById("zip").value,

    date: document.getElementById("job-date").value,
    start_time: document.getElementById("start-time").value,
    end_time: document.getElementById("end-time").value,
    technician: document.getElementById("technician").value,
  };

  const apiToken = "74a4f72f8063143d3b41b034e06f32b1816f957b"; 
  const pipedriveSubdomain = "ty-sandbox"; // Твой поддомен

  try {
    const response = await fetch(`https://api.pipedrive.com/v1/deals?api_token=${apiToken}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: `Job from ${jobData.client_name}`,
        value: 0,
        currency: "USD",
        status: "open",
        visible_to: 3,
        add_time: new Date().toISOString()
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      document.getElementById("status-msg").textContent = `Deal created! ID: ${result.data.id}`;
      document.getElementById("status-msg").style.color = "green";

      // Получаем ссылку из API или формируем вручную
      const dealId = result.data.id;
      let dealUrl = result.data.url
        ? result.data.url
        : `https://${pipedriveSubdomain}.pipedrive.com/deal/${dealId}`;

      document.getElementById("view-deal-link").href = dealUrl;
      document.getElementById("deal-links").style.display = "block";

      const noteText = `
Client: ${jobData.client_name}, ${jobData.client_phone}, ${jobData.client_email}
Job: ${jobData.job_type} from ${jobData.job_source}
Description: ${jobData.description}
Address: ${jobData.address}, ${jobData.city}, ${jobData.state}, ${jobData.zip}
Scheduled: ${jobData.date} from ${jobData.start_time} to ${jobData.end_time}
Technician: ${jobData.technician}
      `;

      await fetch(`https://api.pipedrive.com/v1/notes?api_token=${apiToken}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: noteText,
          deal_id: dealId
        })
      });

    } else {
      throw new Error(result.error || "Failed to create deal");
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("status-msg").textContent = `Error: ${error.message}`;
    document.getElementById("status-msg").style.color = "red";
  }
});
