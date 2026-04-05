const userId = localStorage.getItem('user_id');
if (!userId) {
  alert("Please login first!");
  window.location.href = "index.html"; // Redirect to login/register page
}


async function loadMyCourses() {
  try {
    const res = await fetch('http://localhost:3000/api/courses');
    const courses = await res.json();

    const coursesList = document.getElementById('courses-list');
    coursesList.innerHTML = '';

    courses.forEach(course => {
      const courseDiv = document.createElement('div');
      courseDiv.className = 'form-group';
      courseDiv.innerHTML = `
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <button onclick="enroll(${course.id})">Enroll</button>
        <hr>
      `;
      coursesList.appendChild(courseDiv);
    });
  } catch (err) {
    alert("Failed to load courses. Please try again later.");
    console.error(err);
  }
}
loadMyCourses();

