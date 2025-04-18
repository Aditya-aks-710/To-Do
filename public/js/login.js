document.getElementById('login').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const form = e.target;
    const data = {
      username: form.username.value,
      password: form.password.value
    };

    console.log(form);
  
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
  
      const result = await response.json();
      console.log(result);
      alert(result.message);
  
      if (response.ok) {
        // optionally redirect or show user panel
        // window.location.href = '/dashboard';
        localStorage.setItem("userId", JSON.stringify(result));

      // ✅ Redirect to dashboard.html
        window.location.href = "/dashboard.html";
      }
  
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  });
  