document.getElementById('register').addEventListener('submit', async function (e) {
    e.preventDefault(); // prevent page reload
  
    const form = e.target;
    const formData = new FormData(form); // collects all form inputs including the file
  
    try {
      const response = await fetch('/register', {
        method: 'POST',
        body: formData // no need for headers here, browser sets them automatically for multipart/form-data
      });
  
      const result = await response.json();
      alert(result.message);

      if (response.ok) {
        // ✅ Clear the form
        form.reset();
  
        // ✅ Reset image preview and label
        const label = document.getElementById('uploadLabel');
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
  
        label.textContent = 'Choose Profile Image';
        preview.style.display = 'none';
        previewImg.src = '';
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.error(err);
    }
  });

  document.getElementById('imageUpload').addEventListener('change', function () {
    const label = document.getElementById('uploadLabel');
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const file = this.files[0];
  
    if (file) {
      // Change label text
      label.textContent = 'Change Profile Image';
  
      // Preview the image
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImg.src = e.target.result;
        preview.style.display = 'flex'; 
      };
      reader.readAsDataURL(file);
    } else {
      // Reset if no file is selected
      label.textContent = 'Choose Profile Image';
      preview.style.display = 'none';
      previewImg.src = '';
    }
  });
  