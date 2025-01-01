let userID = null;
let isEditMode = false;

// Fetch user data and tasks
async function fetchUserProfile() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("User not logged in. Redirecting to login page.");
    window.location.href = "index.html";
    return;
  }
  console.log("Token:", token); // Debugging log
  const url = "https://scrud.free.nf/Task/api/get_user_info.php";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Fetched User Data:", data); // Debugging log
      userID = data.user?.id || null;
      displayUserInfo(data.user);
      displayTasks(data.tasks);
    } else {
      const errorData = await response.json();
      console.error("Error fetching user profile:", errorData);
      alert("Error: " + (errorData.error || "Unknown error occurred"));
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Unable to fetch user profile. Please try again later.");
  }
}

function displayUserInfo(user) {
  const userInfoElement = document.getElementById("user-info");
  const userProfilePic = document.getElementById("profile-pic");
  if (user.profilepic) {
    // alert("Profile Picture Found");
    userProfilePic.src = `${user.profilepic}`;
    userProfilePic.alt = user.name;
  }
  userInfoElement.innerHTML = user
    ? `<p><strong>Name:</strong> ${user.name}</p><p><strong>Email:</strong> ${user.email}</p>`
    : "<p>No user information available.</p>";
}

function displayTasks(tasks) {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  if (tasks && tasks.length > 0) {
    tasks.forEach((task) => {
      if (task.task_title && task.task_description && task.task_id) {
        const taskItem = document.createElement("li");
        taskItem.classList.add(
          "task-item",
          "bg-gray-50",
          "p-4",
          "border",
          "rounded",
          "flex",
          "flex-col",
          "md:flex-row",
          "justify-between",
          "items-start",
          "md:items-center"
        );

        taskItem.innerHTML = `
            <div class="w-full md:w-1/3 mb-4 md:mb-0">
              <strong class="block text-lg">${task.task_title}</strong>
              <p class="text-gray-700">${task.task_description}</p>
            </div>
            <div class="w-full md:w-1/3 mb-4 md:mb-0">
              <p><strong>Priority:</strong> <span class="text-blue-600">${task.priority || "Not set"}</span></p>
              <p><strong>Deadline:</strong> <span class="text-gray-700">${task.due_date || "No deadline"}</span></p>
            </div>
            <div class="w-full md:w-1/3 flex items-center justify-between md:justify-end">
              <p class="task-status text-gray-600"><strong>Status:</strong> ${task.status || "Pending"}</p>
              
              <button id="done-${task.task_id}" class="bg-green-500 text-white px-4 py-2 rounded ml-4 hover:bg-green-600">Done</button>

              ${isEditMode
                ? `<button id="edit-${task.task_id}" class="edit-task-btn bg-blue-500 text-white px-2 py-1 rounded ml-4 hover:bg-blue-600">Edit</button>
                  <button id="del-${task.task_id}" class="edit-task-btn bg-red-500 text-white px-2 py-1 rounded ml-4 hover:bg-blue-600">Delete</button>`
                : ""
              }
            </div>
        `;

        taskList.appendChild(taskItem);

        // Attach event listeners for buttons
        const doneButton = taskItem.querySelector(`#done-${task.task_id}`);
        const delButton = taskItem.querySelector(`#del-${task.task_id}`);

        // Hide Done button if the task status is 'Done'
        if (doneButton && task.status === "Done") {
          doneButton.classList.add("hidden");
          taskItem.classList.add("bg-green-100"); // Optionally highlight completed tasks
        }

        if (doneButton) {
          doneButton.addEventListener("click", () => updateTaskStatus(task.task_id));
        } else {
          console.warn(`Done button not found for task ID ${task.task_id}`);
        }

        if (delButton) {
          delButton.addEventListener("click", () => deleteTask(task.task_id));
        } else {
          console.warn(`Delete button not found for task ID ${task.task_id}`);
        }

        if (isEditMode) {
          const editButton = taskItem.querySelector(`#edit-${task.task_id}`);
          if (editButton) {
            editButton.addEventListener("click", () => showEditTaskForm(task));
          } else {
            console.warn(`Edit button not found for task ID ${task.task_id}`);
          }
        }
      } else {
        console.warn("Incomplete task data:", task);
      }
    });

    if (!taskList.hasChildNodes()) {
      taskList.innerHTML = "<p>No valid tasks available.</p>";
    }
  } else {
    taskList.innerHTML = "<p>No tasks available.</p>";
  }
}



function showEditTaskForm(task) {
  // Populate the edit form fields with existing values
  const editForm = document.getElementById("edit-task-form");
  const taskList = document.getElementById("task-list");
  document.getElementById("task-title").value = task.task_title;
  document.getElementById("task-desc").value = task.task_description;
  document.getElementById("task-priority").value = task.priority;
  document.getElementById("task-date").value = task.due_date;
  document.getElementById("task-status").value = task.status;

  // Show the edit form
  document.getElementById("task-list").classList.toggle("hidden");
  editForm.classList.remove("hidden");

  // Attach a submit event listener for the edit form
  editForm.onsubmit = (e) => {
    e.preventDefault();
    updateTask(task.task_id);
  };
}

async function updateTask(taskID) {
  const title = document.getElementById("task-title").value;
  const desc = document.getElementById("task-desc").value;
  const priority = document.getElementById("task-priority").value;
  const date = document.getElementById("task-date").value;
  const status = document.getElementById("task-status").value;

  // const token = localStorage.getItem("token");
  const url = `https://scrud.free.nf/Task/api/task-update.php`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ type: 'update', taskID, title, desc, priority, date, status }),
    });

    const result = await response.json();
    if (result.status) {
      alert("Task update Successful!");
      window.location.href = "profile.html"; // Redirect after success
    } else {
      alert("Failed to update task.");
    }
  } catch (error) {
    console.error("Updating Task Error:", error);
    alert("Unable to update task. Please try again later.");
  }
}

// Show/Hide Add Task Form
document.getElementById("add-task-btn").addEventListener("click", () => {
  document.getElementById("task-form").classList.toggle("hidden");
  document.getElementById("task-list").classList.toggle("hidden");
});

// Toggle Edit Mode
document.getElementById("edit-tasks-btn").addEventListener("click", () => {
  isEditMode = !isEditMode;
  displayTasks([]); // Clear task list
  fetchUserProfile(); // Reload with edit mode changes
});


// Add Task
document.getElementById("task-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const addTitle = document.getElementById("add-task-title").value;
  const addDesc = document.getElementById("add-task-desc").value;
  const addPriority = document.getElementById("add-task-priority").value;
  const addDate = document.getElementById("add-task-date").value;

  // const userID = localStorage.getItem('userID'); // Ensure userID is available

  if (!userID) {
    alert("User ID not available.");
    return;
  }

  try {
    const response = await fetch("https://scrud.free.nf/Task/api/task-add.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID, Title: addTitle, Desc: addDesc, Priority: addPriority, Date: addDate }), 
    });

    const result = await response.json();
    if (result.status) {
      alert("Task added successfully!");
      window.location.href = "profile.html"; // Redirect after success
      document.getElementById("task-form").reset(); // Optional: reset the form
    } else {
      alert("Failed to add task: " + result.message);
    }
  } catch (error) {
    console.error("Add Task Error:", error);
    alert("Unable to add task. Please try again later.");
  }
});


// Update Task
// status done


async function updateTaskStatus(taskID) {
  try {
    const response = await fetch("https://scrud.free.nf/Task/api/task-update.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: 'status', taskID }), // Include type alongside taskID
    });

    const result = await response.json();
    if (result.status) {
      alert("Task status updated to 'Done'!");
      // document.getElementById(`done-${taskID}`).classList.add("hidden");
      fetchUserProfile(); // Refresh tasks
    } else {
      alert("Failed to update task status.");
    }
  } catch (error) {
    console.error("Update Task Status Error:", error);
    alert("Unable to update task status. Please try again later.");
  }
}

// delete task


async function deleteTask(taskID) {
  try {
    const response = await fetch("https://scrud.free.nf/Task/api/task-update.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: 'delete', taskID }), // Include type alongside taskID
    });

    const result = await response.json();
    if (result.status) {
      alert("Deleted the Task!");
      fetchUserProfile(); // Refresh tasks
    } else {
      alert("Failed to Delete Task.");
    }
  } catch (error) {
    console.error("Delete Task Status Error:", error);
    alert("Unable to Delete the Task. Please try again later.");
  }
}

// Fetch user profile on page load
fetchUserProfile();
