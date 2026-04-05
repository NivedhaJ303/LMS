document.addEventListener("DOMContentLoaded", loadCourses);

async function loadCourses() {
  try {
    const res = await fetch('http://localhost:3000/api/courses');
    
    if (!res.ok) { // Check if the response is an error
      throw new Error(`HTTP Error: ${res.status} - ${res.statusText}`);
    }

    const courses = await res.json();
    console.log("Courses loaded successfully:", courses);

    const coursesList = document.getElementById('courses-list');
    coursesList.innerHTML = '';

    courses.forEach(course => {
      const courseDiv = document.createElement('div');
      courseDiv.className = 'course-item';
      courseDiv.innerHTML = `
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <button onclick="enroll(${course.id})">Enroll</button>
        <hr>
      `;
      coursesList.appendChild(courseDiv);
    });
  } catch (err) {
    console.error("Error loading courses:", err);

    if (err instanceof SyntaxError) {
      alert("Received an invalid response format. Please try again later.");
    } else {
      alert(`Failed to load courses: ${err.message}`);
    }
  }
}
