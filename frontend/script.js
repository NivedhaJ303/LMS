// Smooth scroll and section switching for nav links
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    document.querySelectorAll('section').forEach(section => section.classList.remove('active'));
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add('active');
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Initialize view: show home section on load and update logout button
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('section').forEach(section => section.classList.remove('active'));
  document.getElementById('home')?.classList.add('active');

  if (localStorage.getItem('user_id')) {
    loadCourses();
    loadMyCourses();
  }
  updateLogoutButton();
});

// Register handler
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;

  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    alert(data.message);
  } catch (err) {
    alert("Error during registration. Please try again.");
    console.error(err);
  }
});

// Login handler with smooth scroll to Courses
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      localStorage.setItem('user_id', data.user_id);
      loadCourses();
      loadMyCourses();

      // Switch to Courses section and scroll smoothly
      document.querySelectorAll('section').forEach(section => section.classList.remove('active'));
      const coursesSection = document.getElementById('courses');
      if (coursesSection) {
        coursesSection.classList.add('active');
        coursesSection.scrollIntoView({ behavior: 'smooth' });
      }

      updateLogoutButton();
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    alert("Error during login. Please try again.");
    console.error(err);
  }
});

// Load available courses
async function loadCourses() {
  try {
    const res = await fetch('http://localhost:3000/api/courses');
    const courses = await res.json();
    const container = document.getElementById('courses-container');
    if (!container) return;
    container.innerHTML = '';

    courses.forEach(course => {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <button onclick="enroll(${course.id})">Enroll</button>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    alert("Failed to load courses.");
    console.error(err);
  }
}

// Handle enroll with smooth scroll to Payment
window.enroll = function(courseId) {
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    alert("Please login to enroll.");
    return;
  }
  localStorage.setItem('selected_course', courseId);

  // Switch to Payment section and scroll smoothly
  document.querySelectorAll('section').forEach(section => section.classList.remove('active'));
  const paymentSection = document.getElementById('payment-section');
  if (paymentSection) {
    paymentSection.classList.add('active');
    paymentSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Simulate payment and enroll, then smooth scroll to My Courses
document.getElementById('pay-btn')?.addEventListener('click', async () => {
  const userId = localStorage.getItem('user_id');
  const courseId = localStorage.getItem('selected_course');

  if (!userId || !courseId) {
    alert("Please login and select a course first.");
    return;
  }

  try {
    alert("Payment successful!");
    const res = await fetch('http://localhost:3000/api/courses/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, course_id: courseId })
    });
    const data = await res.json();
    alert(data.message);
    loadMyCourses();

    // Switch to My Courses section and scroll smoothly
    document.querySelectorAll('section').forEach(section => section.classList.remove('active'));
    const myCoursesSection = document.getElementById('mycourses');
    if (myCoursesSection) {
      myCoursesSection.classList.add('active');
      myCoursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  } catch (err) {
    alert("Enrollment failed.");
    console.error(err);
  }
});

// Load enrolled courses
async function loadMyCourses() {
  const userId = localStorage.getItem('user_id');
  if (!userId) return;

  try {
    const res = await fetch(`http://localhost:3000/api/courses/mycourses/${userId}`);
    const courses = await res.json();
    const container = document.getElementById('mycourses-container');
    if (!container) return;

    container.innerHTML = '';

    if (!courses.length) {
      container.innerHTML = "<p>No courses enrolled yet.</p>";
      return;
    }

    courses.forEach(course => {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <h3>${course.title}</h3>
        <p>${course.description}</p>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    alert("Failed to load enrolled courses.");
    console.error(err);
  }
}

// Function to show/hide the logout button
function updateLogoutButton() {
  const logoutBtn = document.getElementById('logout-btn');
  if (!logoutBtn) return;
  if (localStorage.getItem('user_id')) {
    logoutBtn.style.display = 'inline-block';
  } else {
    logoutBtn.style.display = 'none';
  }
}

// Logout event handler
document.getElementById('logout-btn')?.addEventListener('click', () => {
  localStorage.removeItem('user_id');
  localStorage.removeItem('selected_course');
  alert("Logged out successfully!");
  // Switch to Home section
  document.querySelectorAll('section').forEach(section => section.classList.remove('active'));
  document.getElementById('home')?.classList.add('active');
  updateLogoutButton();
});
