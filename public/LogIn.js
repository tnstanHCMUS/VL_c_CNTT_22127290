login.js
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('login-form');
  const emailField = document.getElementById('email');
  const passwordField = document.getElementById('password');

  // Function to validate email
  function validateEmail(email) {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return emailPattern.test(email);
  }

  form.addEventListener('submit', function (e) {
      e.preventDefault(); // Ngăn hành động mặc định của form

      const email = emailField.value;
      const password = passwordField.value;

      // Validate email
      if (!validateEmail(email)) {
          alert('Please enter a valid email address.');
          return;
      }

      // Gửi dữ liệu lên server
      const loginData = {
          email: email,
          password: password
      };

      fetch('http://localhost:8000/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert('Login successful! Redirecting...');
              window.location.href = "http://127.0.0.1:1880/ui/#!/1?socketid=ZSaPo7yEDqX5gJcqAABT"; // Chuyển đến trang chính sau khi đăng nhập
          } else {
              alert(data.message || 'Invalid email or password.');
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert('An error occurred. Please try again later.');
      });
  });
});