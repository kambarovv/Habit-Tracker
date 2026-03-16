const today = new Date();

document.getElementById("calendarDate").innerText = today.toLocaleDateString(
  "en-US",
  { month: "long", day: "numeric" },
);

document.getElementById("currentDay").innerText = today.toLocaleDateString(
  "en-US",
  { day: "numeric", month: "long", year: "numeric" },
);


const calendar = document.getElementById("calendar");

function generateCalendar() {
  calendar.innerHTML = "";

  const year = today.getFullYear();
  const month = today.getMonth();

  const totalDays = new Date(year, month + 1, 0).getDate();

  for (let i = 1; i <= totalDays; i++) {
    const day = document.createElement("div");
    day.classList.add("day");

    if (i > today.getDate()) {
      day.classList.add("future");
    }

    if (i === today.getDate()) {
      day.classList.add("today");
    }

    calendar.appendChild(day);
  }
}

generateCalendar();


const circles = document.querySelectorAll(".habit_circle");

circles.forEach((circle) => {
  circle.addEventListener("click", () => {
    circle.classList.toggle("done");

    const habit = circle.closest(".habit_list");

    habit.classList.toggle("done");

    updateProgress();
  });
});

function updateProgress() {
  const totalHabits = document.querySelectorAll(".habit_circle").length;
  const completed = document.querySelectorAll(".habit_circle.done").length;

  const percent = Math.floor((completed / totalHabits) * 100);

  document.getElementById("percent").innerText = percent + "%";
  document.getElementById("completedCount").innerText =
    completed + "/" + totalHabits;

  document.getElementById("progressBar").style.width = percent + "%";


  const todayIndex = today.getDate() - 1;
  const days = document.querySelectorAll(".day");

  const todayDay = days[todayIndex];

  if (!todayDay) return;

  todayDay.classList.remove("level1", "level2", "level3");

  if (percent > 0 && percent <= 40) {
    todayDay.classList.add("level1");
  } else if (percent > 40 && percent <= 80) {
    todayDay.classList.add("level2");
  } else if (percent > 80) {
    todayDay.classList.add("level3");
  }
}


const addHabitBtn = document.querySelector(".add_habit");
const modal = document.getElementById("habitModal");
const createBtn = document.getElementById("addHabitBtn");
const error = document.getElementById("habitError");

const habitNameInput = document.getElementById("habitName");
const habitIconInput = document.getElementById("habitIcon");

const habitListBox = document.querySelector(".habit_list_box");

addHabitBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

createBtn.addEventListener("click", addHabit);


function addHabit() {
  const name = habitNameInput.value.trim();
  const icon = habitIconInput.value.trim();

  if (name === "") {
    error.innerText = "Please enter habit name";
    return;
  }

  const existing = [...document.querySelectorAll(".habit_name")];

  if (existing.some((h) => h.innerText.toLowerCase() === name.toLowerCase())) {
    error.innerText = "Habit already exists";
    return;
  }

  error.innerText = "";

  const habit = document.createElement("div");
  habit.classList.add("habit_list");

  habit.innerHTML = `
<div class="habit_circle"></div>

<div class="habit_content">
<div class="habit_icon">${icon || "⭐"}</div>
<div class="habit_name">${name}</div>
</div>

<div class="habit_delete">✖</div>
`;

  habitListBox.appendChild(habit);

  habitNameInput.value = "";
  habitIconInput.value = "";

  modal.style.display = "none";

  attachCircle(habit);
  attachDelete(habit);

  saveHabits();
  updateProgress();
}


function attachCircle(habit) {
  const circle = habit.querySelector(".habit_circle");

  circle.addEventListener("click", () => {
    circle.classList.toggle("done");

    const habitItem = circle.closest(".habit_list");

    habitItem.classList.toggle("done");

    updateProgress();
  });
}


const quickButtons = document.querySelectorAll(".quickButtons button");

quickButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const icon = button.dataset.icon;

    habitNameInput.value = name;
    habitIconInput.value = icon;
  });
});

function attachDelete(habit) {
  const del = habit.querySelector(".habit_delete");

  del.addEventListener("click", () => {
    habit.remove();

    saveHabits();

    updateProgress();
  });
}

updateProgress();
