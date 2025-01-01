document.addEventListener("DOMContentLoaded", () => {
  const uploadPicInput = document.getElementById("upload-pic");
  const uploadPicButton = document.getElementById("upload-pic-btn");

  // Trigger file input dialog when the button is clicked
  uploadPicButton.addEventListener("click", () => {
    uploadPicInput.click();
  });

  // Handle the image file selection and API upload
  uploadPicInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Display the image locally for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById("profile-pic").src = e.target.result;
      };
      reader.readAsDataURL(file);

      // Send the image via an API call
      try {
        const formData = new FormData();
        formData.append("profilepic", file); // Match the key in PHP
        formData.append('user_id', userID); // Replace userID with the actual user ID value
        formData.append("type", "profilepic");

        // Make the API call
        const response = await fetch("http://localhost/TASK/api/profilepic.php", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Image uploaded successfully:", result);
          // Optionally display a success message
          alert("Profile picture updated successfully!");
        } else {
          console.error("Failed to upload image:", response.statusText);
          alert("Failed to upload image. Please try again.");
        }
      } catch (error) {
        console.error("Error during upload:", error);
        alert("An error occurred while uploading the image.");
      }
    }
  });
});
