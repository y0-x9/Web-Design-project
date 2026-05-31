// JavaScript for Bisharah Alsarraf's CSC 307 academic advising project

// These names are used as the browser database keys.
const COURSES_DB_KEY = "aduCoursesDb";
const STUDENT_COURSES_KEY = "aduStudentCourses";

// Advising tips shown on the Tips page.
const advisingTips = [
  "Do not choose a course before checking its prerequisites.",
  "Keep a balanced semester by mixing technical and general education courses.",
  "If you are repeating a difficult course, reduce your total credit load.",
  "Register early and keep backup sections ready.",
  "Use your study plan as a checklist every semester.",
  "Ask your advisor about summer courses if you are behind schedule."
];

// This function creates the first course records for the browser database.
function createDefaultCourses() {
  return [
    {
      code: "ENG 100",
      title: "Academic English",
      credits: 3,
      level: "100",
      prerequisites: [],
      description: "Builds academic reading, writing, and communication skills.",
      type: "Default"
    },
    {
      code: "MTH 101",
      title: "College Mathematics",
      credits: 3,
      level: "100",
      prerequisites: [],
      description: "Introduces mathematical foundations needed for computing and science courses.",
      type: "Default"
    },
    {
      code: "CSC 101",
      title: "Introduction to Programming",
      credits: 3,
      level: "100",
      prerequisites: [],
      description: "Covers basic programming concepts, variables, conditions, loops, and functions.",
      type: "Default"
    },
    {
      code: "GEN 101",
      title: "University Success Skills",
      credits: 3,
      level: "100",
      prerequisites: [],
      description: "Develops study skills, time management, and academic planning habits.",
      type: "Default"
    },
    {
      code: "ENG 200",
      title: "Technical Writing",
      credits: 3,
      level: "200",
      prerequisites: ["ENG 100"],
      description: "Focuses on technical reports, professional communication, and presentations.",
      type: "Default"
    },
    {
      code: "MTH 102",
      title: "Discrete Mathematics",
      credits: 3,
      level: "100",
      prerequisites: ["MTH 101"],
      description: "Introduces logic, sets, functions, proofs, and graph concepts.",
      type: "Default"
    },
    {
      code: "CSC 102",
      title: "Object-Oriented Programming",
      credits: 3,
      level: "100",
      prerequisites: ["CSC 101"],
      description: "Explores classes, objects, inheritance, arrays, and problem solving.",
      type: "Default"
    },
    {
      code: "CIS 110",
      title: "Computer Applications",
      credits: 3,
      level: "100",
      prerequisites: [],
      description: "Introduces common productivity tools and digital information management.",
      type: "Default"
    },
    {
      code: "CSC 201",
      title: "Data Structures",
      credits: 3,
      level: "200",
      prerequisites: ["CSC 102"],
      description: "Studies arrays, linked lists, stacks, queues, trees, and algorithm efficiency.",
      type: "Default"
    },
    {
      code: "CSC 202",
      title: "Database Systems",
      credits: 3,
      level: "200",
      prerequisites: ["CSC 102"],
      description: "Covers database design, SQL queries, relationships, and normalization.",
      type: "Default"
    },
    {
      code: "STA 201",
      title: "Statistics for Computing",
      credits: 3,
      level: "200",
      prerequisites: ["MTH 101"],
      description: "Introduces descriptive statistics, probability, sampling, and data analysis.",
      type: "Default"
    },
    {
      code: "CSC 307",
      title: "Web Design and Programming",
      credits: 3,
      level: "300",
      prerequisites: ["CSC 102"],
      description: "Develops websites using HTML5, CSS3, JavaScript, forms, tables, and events.",
      type: "Default"
    },
    {
      code: "CSC 320",
      title: "Software Engineering",
      credits: 3,
      level: "300",
      prerequisites: ["CSC 201"],
      description: "Introduces software requirements, design, implementation, testing, and teamwork.",
      type: "Default"
    },
    {
      code: "CSC 330",
      title: "Computer Networks",
      credits: 3,
      level: "300",
      prerequisites: ["CSC 201"],
      description: "Explains network models, protocols, addressing, routing, and security basics.",
      type: "Default"
    }
  ];
}

// If the browser database is empty, load the default courses.
function initializeCoursesDatabase() {
  if (!localStorage.getItem(COURSES_DB_KEY)) {
    saveCourseCatalog(createDefaultCourses());
  }
}

// Read all courses from the browser database.
function getCourseCatalog() {
  const stored = localStorage.getItem(COURSES_DB_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Save all courses back into the browser database.
function saveCourseCatalog(courses) {
  localStorage.setItem(COURSES_DB_KEY, JSON.stringify(courses));
}

// Restore the database to the original project course list.
function resetCourseDatabase() {
  saveCourseCatalog(createDefaultCourses());
}

// Find one course by its course code.
function findCourse(code) {
  return getCourseCatalog().find((course) => course.code === code);
}

// Add a new course or update an existing course.
function upsertCourse(course) {
  const courses = getCourseCatalog();
  const existingIndex = courses.findIndex((item) => item.code === course.code);

  if (existingIndex >= 0) {
    courses[existingIndex] = course;
  } else {
    courses.push(course);
  }

  saveCourseCatalog(courses);
}

// Delete a course from the database and remove it from the student's list.
function deleteCourseFromDb(code) {
  const courses = getCourseCatalog().filter((course) => course.code !== code);
  saveCourseCatalog(courses);
  saveStoredCourses(getStoredCourses().filter((course) => course.code !== code));
}

// Read the student's selected courses.
function getStoredCourses() {
  const stored = localStorage.getItem(STUDENT_COURSES_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Save the student's selected courses.
function saveStoredCourses(courses) {
  localStorage.setItem(STUDENT_COURSES_KEY, JSON.stringify(courses));
}

// Mobile menu button for small screens.
function setupNavigation() {
  const button = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
}

// Setup the Study Plan page form and table.
function setupStudyPlan() {
  const form = document.getElementById("courseForm");
  if (!form) return;

  const select = document.getElementById("courseCode");
  const clearButton = document.getElementById("clearCourses");

  getCourseCatalog().forEach((course) => {
    const option = document.createElement("option");
    option.value = course.code;
    option.textContent = `${course.code} - ${course.title}`;
    select.appendChild(option);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    addCourse();
  });

  clearButton.addEventListener("click", () => {
    if (confirm("Clear all tracked courses?")) {
      saveStoredCourses([]);
      renderStudyPlan();
      showCourseMessage("All courses were cleared.", "success");
    }
  });

  renderStudyPlan();
}

// Add one selected course to the student's plan.
function addCourse() {
  const code = document.getElementById("courseCode").value;
  const status = document.getElementById("courseStatus").value;
  const grade = document.getElementById("courseGrade").value;
  const course = findCourse(code);

  if (!course) {
    showCourseMessage("Please choose a course.", "error");
    return;
  }

  const courses = getStoredCourses();
  if (courses.some((item) => item.code === code)) {
    showCourseMessage("This course is already in your list.", "error");
    return;
  }

  if (status === "completed" && grade === "") {
    showCourseMessage("Completed courses should include a grade.", "error");
    return;
  }

  courses.push({ code, status, grade });
  saveStoredCourses(courses);
  document.getElementById("courseForm").reset();
  renderStudyPlan();
  showCourseMessage(`${code} was added to your plan.`, "success");
}

// Remove one course from the student's plan.
function removeCourse(code) {
  const updated = getStoredCourses().filter((course) => course.code !== code);
  saveStoredCourses(updated);
  renderStudyPlan();
}

// Show the student's courses in the table.
function renderStudyPlan() {
  const tbody = document.getElementById("studentCourses");
  const recommendations = document.getElementById("recommendations");
  if (!tbody || !recommendations) return;

  const courses = getStoredCourses();
  tbody.innerHTML = "";

  if (courses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">No courses added yet. Use the form to upload your classes.</td></tr>';
  } else {
    courses.forEach((item) => {
      const course = findCourse(item.code);
      if (!course) return;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.code}</td>
        <td>${course.title}</td>
        <td>${course.credits}</td>
        <td><span class="status-pill status-${item.status}">${item.status}</span></td>
        <td>${item.grade === "" ? "Not graded" : gradeLabel(item.grade)}</td>
        <td><button class="button danger" type="button" data-remove="${item.code}">Remove</button></td>
      `;
      tbody.appendChild(row);
    });
  }

  tbody.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => removeCourse(button.dataset.remove));
  });

  updateStats(courses);
  renderRecommendations(courses);
}

// Calculate completed credits and estimated GPA.
function updateStats(courses) {
  const completed = courses.filter((item) => item.status === "completed");
  let credits = 0;
  let points = 0;

  completed.forEach((item) => {
    const course = findCourse(item.code);
    if (!course) return;

    credits += course.credits;
    if (item.grade !== "") {
      points += Number(item.grade) * course.credits;
    }
  });

  const gpa = credits > 0 ? points / credits : 0;
  document.getElementById("totalCredits").textContent = credits;
  document.getElementById("gpaValue").textContent = gpa.toFixed(2);
  document.getElementById("courseCount").textContent = courses.length;
}

// Recommend courses when their prerequisites are completed.
function renderRecommendations(studentCourses) {
  const container = document.getElementById("recommendations");
  const completedCodes = studentCourses
    .filter((item) => item.status === "completed")
    .map((item) => item.code);
  const selectedCodes = studentCourses.map((item) => item.code);

  const recommended = getCourseCatalog().filter((course) => {
    const notSelected = !selectedCodes.includes(course.code);
    const prerequisitesMet = course.prerequisites.every((code) => completedCodes.includes(code));
    return notSelected && prerequisitesMet;
  });

  container.innerHTML = "";

  if (recommended.length === 0) {
    container.innerHTML = '<p class="muted">Add completed courses to receive recommendations.</p>';
    return;
  }

  recommended.slice(0, 6).forEach((course) => {
    const card = document.createElement("article");
    card.className = "recommendation-card";
    card.innerHTML = `
      <h3>${course.code}</h3>
      <p><strong>${course.title}</strong></p>
      <p>${course.credits} credits. Prerequisites: ${course.prerequisites.length ? course.prerequisites.join(", ") : "None"}.</p>
    `;
    container.appendChild(card);
  });
}

// Convert GPA points into letter grades.
function gradeLabel(value) {
  const labels = {
    "4": "A",
    "3.5": "B+",
    "3": "B",
    "2.5": "C+",
    "2": "C",
    "1.5": "D+",
    "1": "D",
    "0": "F"
  };
  return labels[value] || "Not graded";
}

// Show messages under the course form.
function showCourseMessage(text, type) {
  const message = document.getElementById("courseMessage");
  if (!message) return;
  message.textContent = text;
  message.className = `form-message ${type}`;
}

// Setup the Course Details page search and filter.
function setupCourseCatalog() {
  const container = document.getElementById("courseCatalog");
  if (!container) return;

  const search = document.getElementById("courseSearch");
  const level = document.getElementById("levelFilter");

  function render() {
    const query = search.value.trim().toLowerCase();
    const selectedLevel = level.value;
    const filtered = getCourseCatalog().filter((course) => {
      const matchesText = course.code.toLowerCase().includes(query) || course.title.toLowerCase().includes(query);
      const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
      return matchesText && matchesLevel;
    });

    container.innerHTML = "";
    filtered.forEach((course) => {
      const card = document.createElement("article");
      card.className = "course-card";
      card.innerHTML = `
        <p class="course-meta">${course.code} | ${course.credits} credits | Level ${course.level}</p>
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <strong>Prerequisites</strong>
        <ul>${course.prerequisites.length ? course.prerequisites.map((item) => `<li>${item}</li>`).join("") : "<li>No prerequisites</li>"}</ul>
      `;
      container.appendChild(card);
    });

    if (filtered.length === 0) {
      container.innerHTML = '<p class="muted">No courses match your search.</p>';
    }
  }

  search.addEventListener("input", render);
  level.addEventListener("change", render);
  render();
}

// Setup the random advising tip button.
function setupTips() {
  const tip = document.getElementById("rotatingTip");
  const button = document.getElementById("newTip");
  if (!tip || !button) return;

  let index = 0;
  function renderTip() {
    tip.textContent = advisingTips[index];
    index = (index + 1) % advisingTips.length;
  }

  button.addEventListener("click", renderTip);
  renderTip();
}

// Setup and validate the contact form.
function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("studentName").value.trim();
    const email = document.getElementById("studentEmail").value.trim();
    const major = document.getElementById("studentMajor").value;
    const type = document.getElementById("messageType").value;
    const text = document.getElementById("studentMessage").value.trim();
    const message = document.getElementById("contactMessage");

    if (name.length < 3) {
      showContactMessage(message, "Please enter your full name.", "error");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      showContactMessage(message, "Please enter a valid email address.", "error");
      return;
    }

    if (!major || !type) {
      showContactMessage(message, "Please choose your major and message type.", "error");
      return;
    }

    if (text.length < 15) {
      showContactMessage(message, "Please write a message with at least 15 characters.", "error");
      return;
    }

    showContactMessage(message, "Your message was submitted successfully.", "success");
    form.reset();
  });
}

// Show messages under the contact form.
function showContactMessage(element, text, type) {
  element.textContent = text;
  element.className = `form-message ${type}`;
}

// Setup admin controls for adding, editing, deleting, and restoring courses.
function setupAdminCourses() {
  const form = document.getElementById("adminCourseForm");
  if (!form) return;

  const restoreButton = document.getElementById("restoreDefaultCourses");
  const cancelButton = document.getElementById("cancelAdminEdit");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveAdminCourseForm();
  });

  restoreButton.addEventListener("click", () => {
    if (confirm("Restore the original course database and remove admin changes?")) {
      resetCourseDatabase();
      saveStoredCourses([]);
      renderAdminCourses();
      resetAdminForm();
      showAdminMessage("The course database was restored.", "success");
    }
  });

  cancelButton.addEventListener("click", resetAdminForm);
  renderAdminCourses();
}

// Save the admin form into the browser database.
function saveAdminCourseForm() {
  const code = document.getElementById("adminCode").value.trim().toUpperCase();
  const originalCode = document.getElementById("adminOriginalCode").value;
  const title = document.getElementById("adminTitle").value.trim();
  const credits = Number(document.getElementById("adminCredits").value);
  const level = document.getElementById("adminLevel").value;
  const prerequisites = document.getElementById("adminPrerequisites").value
    .split(",")
    .map((item) => item.trim().toUpperCase())
    .filter((item) => item.length > 0);
  const description = document.getElementById("adminDescription").value.trim();

  if (!/^[A-Z]{2,4}\s?\d{3}$/.test(code)) {
    showAdminMessage("Course code must look like CSC 410.", "error");
    return;
  }

  if (title.length < 3) {
    showAdminMessage("Please enter a course title.", "error");
    return;
  }

  if (!credits || credits < 1 || credits > 6) {
    showAdminMessage("Credits must be between 1 and 6.", "error");
    return;
  }

  if (!level) {
    showAdminMessage("Please choose a course level.", "error");
    return;
  }

  if (description.length < 12) {
    showAdminMessage("Please write a longer course description.", "error");
    return;
  }

  if (findCourse(code) && code !== originalCode) {
    showAdminMessage("A course with this code already exists.", "error");
    return;
  }

  const existing = findCourse(originalCode || code);
  const course = {
    code,
    title,
    credits,
    level,
    prerequisites,
    description,
    type: existing && existing.type === "Default" ? "Modified" : "Admin"
  };

  if (originalCode && originalCode !== code) {
    deleteCourseFromDb(originalCode);
  }

  upsertCourse(course);
  resetAdminForm();
  renderAdminCourses();
  showAdminMessage(`${code} was saved in the course database.`, "success");
}

// Render all courses in the admin table.
function renderAdminCourses() {
  const tbody = document.getElementById("adminCourseList");
  if (!tbody) return;

  const courses = getCourseCatalog();
  tbody.innerHTML = "";

  if (courses.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7">No courses available. Use Restore Defaults to reload the original database.</td></tr>';
    return;
  }

  courses.forEach((course) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${course.code}</td>
      <td>${course.title}</td>
      <td>${course.credits}</td>
      <td>${course.level}</td>
      <td>${course.prerequisites.length ? course.prerequisites.join(", ") : "None"}</td>
      <td>${course.type || "Admin"}</td>
      <td>
        <button class="button secondary" type="button" data-admin-edit="${course.code}">Edit</button>
        <button class="button danger" type="button" data-admin-remove="${course.code}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  tbody.querySelectorAll("[data-admin-edit]").forEach((button) => {
    button.addEventListener("click", () => editAdminCourse(button.dataset.adminEdit));
  });

  tbody.querySelectorAll("[data-admin-remove]").forEach((button) => {
    button.addEventListener("click", () => deleteAdminCourse(button.dataset.adminRemove));
  });
}

// Fill the admin form with a selected course so it can be modified.
function editAdminCourse(code) {
  const course = findCourse(code);
  if (!course) return;

  document.getElementById("adminOriginalCode").value = course.code;
  document.getElementById("adminCode").value = course.code;
  document.getElementById("adminTitle").value = course.title;
  document.getElementById("adminCredits").value = course.credits;
  document.getElementById("adminLevel").value = course.level;
  document.getElementById("adminPrerequisites").value = course.prerequisites.join(", ");
  document.getElementById("adminDescription").value = course.description;
  document.getElementById("adminFormTitle").textContent = `Edit ${course.code}`;
  document.getElementById("adminSubmitButton").textContent = "Save Changes";
  document.getElementById("cancelAdminEdit").classList.remove("hidden");
  showAdminMessage("Editing course. Save changes or cancel.", "success");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Delete a course from the admin table and database.
function deleteAdminCourse(code) {
  if (!confirm(`Delete ${code} from the course database?`)) return;

  deleteCourseFromDb(code);
  resetAdminForm();
  renderAdminCourses();
  showAdminMessage(`${code} was deleted from the course database.`, "success");
}

// Clear the admin form after saving or cancelling.
function resetAdminForm() {
  const form = document.getElementById("adminCourseForm");
  if (!form) return;

  form.reset();
  document.getElementById("adminOriginalCode").value = "";
  document.getElementById("adminCredits").value = "3";
  document.getElementById("adminFormTitle").textContent = "New Course";
  document.getElementById("adminSubmitButton").textContent = "Add Course";
  document.getElementById("cancelAdminEdit").classList.add("hidden");
}

// Show messages under the admin form.
function showAdminMessage(text, type) {
  const message = document.getElementById("adminMessage");
  if (!message) return;
  message.textContent = text;
  message.className = `form-message ${type}`;
}

// Start the website scripts after the page is loaded.
document.addEventListener("DOMContentLoaded", () => {
  initializeCoursesDatabase();
  setupNavigation();
  setupStudyPlan();
  setupCourseCatalog();
  setupAdminCourses();
  setupTips();
  setupContactForm();
});
