//signup.js
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const passwordField = document.getElementById('password');
  const cfpasswordField = document.getElementById('cfpassword');
  const emailField = document.getElementById('email');
  const surnameField = document.getElementById('surname');
  const nameField = document.getElementById('name');

  function validateEmail(email) {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return emailPattern.test(email);
  }

  function validatePasswordMatch() {

      return passwordField.value === cfpasswordField.value;
  }

  form.addEventListener('submit', function (e) {
      e.preventDefault();

      let formValid = true;

      if (!validateEmail(emailField.value)) {
          formValid = false;
          alert('Please enter a valid email address.');
      }


      if (!validatePasswordMatch()) {
          formValid = false;
          alert('Passwords do not match.');
      }

      if (!formValid) {
          e.preventDefault();
      } else {
          const userData = {
              surname: surnameField.value,
              name: nameField.value,
              email: emailField.value,
              password: passwordField.value,
              cfpassword: cfpasswordField.value
          };

          fetch('http://localhost:8000/signup', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(userData),
          })
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  alert('User created successfully.');
                  window.location.href = "login.html";
              } else {
                  alert(data.message || 'Signup failed.');
              }
          })
          .catch(error => {
              console.error('Error:', error);
              alert('An error occurred.');
          });
      }
  });
});