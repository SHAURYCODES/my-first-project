(function () {
  const username = localStorage.getItem("todoUser");
  const currentPage = window.location.pathname.split("/").pop();

  if (!username && currentPage !== "login.html" && currentPage !== "") {
    window.location.href = "login.html";
    return;
  }

  const welcomeText = document.getElementById("welcomeText");
  if (welcomeText && username) {
    welcomeText.textContent = "Welcome, " + username + ". Plan, focus, and complete your goals.";
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("todoUser");
      localStorage.removeItem("todoTasks");
    });
  }

  initTodo();
  initContact();

  function initTodo() {
    const todoForm = document.getElementById("todoForm");
    const todoInput = document.getElementById("todoInput");
    const todoDate = document.getElementById("todoDate");
    const pendingList = document.getElementById("pendingList");
    const completedList = document.getElementById("completedList");
    const pendingEmptyState = document.getElementById("pendingEmptyState");
    const completedEmptyState = document.getElementById("completedEmptyState");
    const totalCount = document.getElementById("totalCount");
    const pendingCount = document.getElementById("pendingCount");
    const doneCount = document.getElementById("doneCount");

    if (!todoForm || !todoInput || !pendingList || !completedList) {
      return;
    }

    let tasks = readTasks();
    render();

    todoForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const text = todoInput.value.trim();
      if (!text) {
        return;
      }

      tasks.unshift({
        id: Date.now(),
        text: text,
        dueDate: todoDate ? todoDate.value : "",
        done: false
      });
      todoInput.value = "";
      if (todoDate) {
        todoDate.value = "";
      }
      persist();
      render();
    });

    function render() {
      pendingList.innerHTML = "";
      completedList.innerHTML = "";

      tasks.forEach(function (task) {
        const li = buildTaskItem(task);
        if (task.done) {
          completedList.appendChild(li);
        } else {
          pendingList.appendChild(li);
        }
      });

      const completed = tasks.filter(function (task) {
        return task.done;
      }).length;
      const pending = tasks.length - completed;
      totalCount.textContent = String(tasks.length);
      if (pendingCount) {
        pendingCount.textContent = String(pending);
      }
      doneCount.textContent = String(completed);
      if (pendingEmptyState) {
        pendingEmptyState.style.display = pending ? "none" : "block";
      }
      if (completedEmptyState) {
        completedEmptyState.style.display = completed ? "none" : "block";
      }
    }

    function buildTaskItem(task) {
      const li = document.createElement("li");
      li.className = "task-item" + (task.done ? " done" : "");

      const dueText = formatDueDate(task.dueDate);
      li.innerHTML =
        '<div class="task-left">' +
        '<input type="checkbox" ' +
        (task.done ? "checked" : "") +
        ' data-action="toggle" data-id="' +
        task.id +
        '" />' +
        '<div class="task-text-wrap">' +
        '<span class="task-text"></span>' +
        '<span class="task-date">' +
        dueText +
        "</span>" +
        "</div>" +
        "</div>" +
        '<div class="task-actions">' +
        '<button class="icon-btn done" data-action="done" data-id="' +
        task.id +
        '">' +
        (task.done ? "Undo" : "Done") +
        "</button>" +
        '<button class="icon-btn remove" data-action="remove" data-id="' +
        task.id +
        '">Delete</button>' +
        "</div>";

      li.querySelector(".task-text").textContent = task.text;
      return li;
    }

    function formatDueDate(dateValue) {
      if (!dateValue) {
        return "No due date";
      }
      const date = new Date(dateValue);
      if (Number.isNaN(date.getTime())) {
        return "No due date";
      }
      return "Due: " + date.toLocaleDateString();
    }

    function updateTaskById(id, updater) {
      tasks = tasks.map(function (task) {
        if (task.id === id) {
          return updater(task);
        }
        return task;
      });
    }

    function handleTaskClick(event) {
      const target = event.target;
      const action = target.getAttribute("data-action");
      const id = Number(target.getAttribute("data-id"));
      if (!action || !id) {
        return;
      }

      if (action === "remove") {
        tasks = tasks.filter(function (task) {
          return task.id !== id;
        });
      } else if (action === "done") {
        updateTaskById(id, function (task) {
          return {
            id: task.id,
            text: task.text,
            dueDate: task.dueDate || "",
            done: !task.done
          };
        });
      }

      persist();
      render();
    }

    function handleTaskChange(event) {
      const target = event.target;
      if (target.getAttribute("data-action") !== "toggle") {
        return;
      }
      const id = Number(target.getAttribute("data-id"));
      updateTaskById(id, function (task) {
        return {
          id: task.id,
          text: task.text,
          dueDate: task.dueDate || "",
          done: target.checked
        };
      });
      persist();
      render();
    }

    pendingList.addEventListener("click", handleTaskClick);
    completedList.addEventListener("click", handleTaskClick);
    pendingList.addEventListener("change", handleTaskChange);
    completedList.addEventListener("change", handleTaskChange);

    function persist() {
      localStorage.setItem("todoTasks", JSON.stringify(tasks));
    }

    function readTasks() {
      const raw = localStorage.getItem("todoTasks");
      if (!raw) {
        return [];
      }

      try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
          return [];
        }
        return parsed.map(function (task) {
          return {
            id: task.id,
            text: task.text,
            dueDate: task.dueDate || "",
            done: Boolean(task.done)
          };
        });
      } catch (error) {
        return [];
      }
    }
  }

  function initContact() {
    const contactForm = document.getElementById("contactForm");
    const status = document.getElementById("contactStatus");
    if (!contactForm || !status) {
      return;
    }

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      status.className = "success";
      status.textContent = "Message submitted successfully (demo only, no backend).";
      contactForm.reset();
    });
  }
})();
