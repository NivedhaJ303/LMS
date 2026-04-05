const userId = localStorage.getItem('user_id');
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('course_id');

// Validate both IDs
if (!userId || !courseId) {
  alert("Invalid access. Please login and choose a course.");
  window.location.href = "index.html";
}

document.getElementById("pay-btn").addEventListener("click", async () => {
  try {
    const res = await fetch("http://localhost:3000/api/courses/enroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user_id: userId, course_id: courseId })
    });

    if (!res.ok) throw new Error("Failed to enroll in course.");

    const data = await res.json();
    alert("Payment successful! You've been enrolled.");
    window.location.href = "mycourses.html";
  } catch (err) {
    console.error(err);
    alert("Payment failed. Please try again.");
  }
});
