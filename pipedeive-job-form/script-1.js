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
  
    const apiKey = "74a4f72f8063143d3b41b034e06f32b1816f957b"; 
  
    try {
      const response = await fetch("https://api.workiz.com/v1/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          client: {
            name: jobData.client_name,
            phone: jobData.client_phone,
            email: jobData.client_email
          },
          job: {
            type: jobData.job_type,
            source: jobData.job_source,
            description: jobData.description,
            start: `${jobData.date}T${jobData.start_time}:00`,
            end: `${jobData.date}T${jobData.end_time}:00`,
            technician: jobData.technician
          },
          address: {
            street: jobData.address,
            city: jobData.city,
            state: jobData.state,
            zip: jobData.zip
          }
        })
      });
  
      const result = await response.json();
      if (response.ok) {
        document.getElementById("status-msg").textContent = `Job created! ID: ${result.id}`;
        document.getElementById("status-msg").style.color = "green";
      } else {
        throw new Error(result.message || "Failed to create job");
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("status-msg").textContent = `Error: ${error.message}`;
      document.getElementById("status-msg").style.color = "red";
    }
  });