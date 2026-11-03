
"use strict";

const STORAGE_KEY = "taskflow-dashboard-tasks-v1";

const sampleTasks = [
  {
    id: "sample-1",
    title: "Finish portfolio homepage",
    description: "Review the layout, spacing, and mobile navigation.",
    priority: "High",
    status: "In progress",
    dueDate: ""
  },
  {
    id: "sample-2",
    title: "Update GitHub README",
    description: "Document project features, setup, and screenshots.",
    priority: "Medium",
    status: "To do",
    dueDate: ""
  },
  {
    id: "sample-3",
    title: "Plan the next AI project",
    description: "Choose a small project and define its main features.",
    priority: "Low",
    status: "To do",
    dueDate: ""
  },
  {
    id: "sample-4",
    title: "Build the dashboard header",
    description: "Create the responsive navigation and page heading.",
    priority: "Medium",
    status: "Completed",
    dueDate: ""
  }
];

const statusConfig = {
  "To do": { list: "todoList", count: "todoCount" },
  "In progress": { list: "progressList", count: "progressCount" },
  "Completed": { list: "completedList", count: "completedCount" }
};

const elements = {
  dialog: document.getElementById("taskDialog"),
  form: document.getElementById("taskForm"),
  title: document.getElementById("taskTitle"),
  description: document.getElementById("taskDescription"),
  priority: document.getElementById("taskPriority"),
  status: document.getElementById("taskStatus"),
  dueDate: document.getElementById("taskDueDate"),
  error: document.getElementById("formError"),
  search: document.getElementById("searchInput"),
  filter: document.getElementById("priorityFilter"),
  toast: document.getElementById("toast"),
  sidebar: document.getElementById("sidebar"),
  menuToggle: document.getElementById("menuToggle")
};

let tasks = loadTasks();
let editingTaskId = null;
let toastTimeout;

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.warn("Could not load saved tasks:", error);
  }

  return sampleTasks.map(task => ({ ...task }));
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.warn("Could not save tasks:", error);
    showToast("Browser storage is unavailable. Changes may not persist.");
  }
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function formatDate(dateString) {
  if (!dateString) return "No due date";

  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function renderTask(task) {
  const priorityClass = `priority-${task.priority.toLowerCase()}`;
  const nextStatus = {
    "To do": "In progress",
    "In progress": "Completed",
    "Completed": "To do"
  }[task.status];

  const nextAction = {
    "To do": "Start",
    "In progress": "Complete",
    "Completed": "Reopen"
  }[task.status];

  return `
    <article class="task-card" data-task-id="${escapeHTML(task.id)}">
      <div class="task-topline">
        <span class="priority ${priorityClass}">${escapeHTML(task.priority)}</span>
        <button class="task-menu" data-action="edit" data-id="${escapeHTML(task.id)}"
          aria-label="Edit ${escapeHTML(task.title)}" title="Edit task">•••</button>
      </div>
      <h4>${escapeHTML(task.title)}</h4>
      ${task.description
        ? `<p>${escapeHTML(task.description)}</p>`
        : ""}
      <div class="task-bottom">
        <span class="task-date">◷ ${escapeHTML(formatDate(task.dueDate))}</span>
        <div class="task-actions">
          <button class="task-action" data-action="move" data-id="${escapeHTML(task.id)}"
            data-status="${escapeHTML(nextStatus)}">${nextAction}</button>
          <button class="task-action" data-action="delete" data-id="${escapeHTML(task.id)}"
            aria-label="Delete ${escapeHTML(task.title)}">Delete</button>
        </div>
      </div>
    </article>
  `;
}

function renderTasks() {
  const query = elements.search.value.trim().toLowerCase();
  const selectedPriority = elements.filter.value;

  const visibleTasks = tasks.filter(task => {
    const matchesSearch = `${task.title} ${task.description}`
      .toLowerCase().includes(query);
    const matchesPriority = selectedPriority === "all" ||
      task.priority === selectedPriority;

    return matchesSearch && matchesPriority;
  });

  Object.values(statusConfig).forEach(config => {
    document.getElementById(config.list).innerHTML = "";
    document.getElementById(config.count).textContent = "0";
  });

  Object.keys(statusConfig).forEach(status => {
    const columnTasks = visibleTasks.filter(task => task.status === status);
    const config = statusConfig[status];
    const list = document.getElementById(config.list);

    list.innerHTML = columnTasks.length
      ? columnTasks.map(renderTask).join("")
      : `<p class="empty-state">${query || selectedPriority !== "all"
        ? "No matching tasks."
        : "Nothing here yet. Add a task to get started."}</p>`;

    document.getElementById(config.count).textContent = columnTasks.length;
  });

  updateStatistics();
}

function updateStatistics() {
  document.getElementById("totalTasks").textContent = tasks.length;
  document.getElementById("progressTasks").textContent =
    tasks.filter(task => task.status === "In progress").length;
  document.getElementById("completedTasks").textContent =
    tasks.filter(task => task.status === "Completed").length;
  document.getElementById("highTasks").textContent =
    tasks.filter(task => task.priority === "High" && task.status !== "Completed").length;
  document.getElementById("navTaskCount").textContent = tasks.length;
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2600);
}

function openCreateDialog(defaultStatus = "To do") {
  editingTaskId = null;
  elements.form.reset();
  elements.status.value = defaultStatus;
  elements.error.textContent = "";
  document.getElementById("dialogTitle").textContent = "Create a task";
  elements.dialog.showModal();
  elements.title.focus();
}

function openEditDialog(taskId) {
  const task = tasks.find(item => item.id === taskId);
  if (!task) return;

  editingTaskId = taskId;
  elements.title.value = task.title;
  elements.description.value = task.description || "";
  elements.priority.value = task.priority;
  elements.status.value = task.status;
  elements.dueDate.value = task.dueDate || "";
  elements.error.textContent = "";
  document.getElementById("dialogTitle").textContent = "Edit task";
  elements.dialog.showModal();
  elements.title.focus();
}

function handleTaskSubmit(event) {
  event.preventDefault();
  elements.error.textContent = "";

  const title = elements.title.value.trim();
  const description = elements.description.value.trim();

  if (!title) {
    elements.error.textContent = "Please enter a task title.";
    elements.title.focus();
    return;
  }

  const taskData = {
    title,
    description,
    priority: elements.priority.value,
    status: elements.status.value,
    dueDate: elements.dueDate.value
  };

  if (editingTaskId) {
    tasks = tasks.map(task =>
      task.id === editingTaskId ? { ...task, ...taskData } : task
    );
    showToast("Task updated successfully.");
  } else {
    tasks.unshift({
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      ...taskData
    });
    showToast("Task added successfully.");
  }

  saveTasks();
  renderTasks();
  elements.dialog.close();
  elements.form.reset();
  editingTaskId = null;
}

function handleTaskAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const taskId = button.dataset.id;
  const action = button.dataset.action;

  if (action === "edit") {
    openEditDialog(taskId);
    return;
  }

  if (action === "delete") {
    const task = tasks.find(item => item.id === taskId);
    if (!task) return;

    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      return;
    }

    tasks = tasks.filter(item => item.id !== taskId);
    saveTasks();
    renderTasks();
    showToast("Task deleted.");
    return;
  }

  if (action === "move") {
    const nextStatus = button.dataset.status;
    tasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: nextStatus } : task
    );
    saveTasks();
    renderTasks();
    showToast(`Task moved to ${nextStatus}.`);
  }
}

document.getElementById("openTaskModal").addEventListener("click", () => {
  openCreateDialog();
});

document.getElementById("closeTaskModal").addEventListener("click", () => {
  elements.dialog.close();
});

document.getElementById("cancelTask").addEventListener("click", () => {
  elements.dialog.close();
});

elements.form.addEventListener("submit", handleTaskSubmit);
elements.search.addEventListener("input", renderTasks);
elements.filter.addEventListener("change", renderTasks);

document.querySelectorAll(".column-add").forEach(button => {
  button.addEventListener("click", () => {
    openCreateDialog(button.dataset.addStatus);
  });
});

document.querySelectorAll(".task-list").forEach(list => {
  list.addEventListener("click", handleTaskAction);
});

elements.menuToggle.addEventListener("click", () => {
  const isOpen = elements.sidebar.classList.toggle("open");
  elements.menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    elements.sidebar.classList.remove("open");
    elements.menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("todayLabel").textContent =
  new Date().toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });

renderTasks();
