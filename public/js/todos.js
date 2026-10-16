document.addEventListener("DOMContentLoaded", () => {
    const TODO_URL = "https://jsonplaceholder.typicode.com/todos";

    const preloader = document.getElementById("todo-preloader");
    const todoList = document.getElementById("todo-list");
    const errorBlock = document.getElementById("todo-error");
    const filterInfo = document.getElementById("todo-filter-info");


    const filterMode = Math.random() < 0.5 ? "high" : "low";

    function updateFilterInfo() {
        if (filterMode === "high") {
            filterInfo.textContent =
                "Показаны задачи с id от 101 до 200 (псевдослучайный фильтр).";
        } else {
            filterInfo.textContent =
                "Показаны задачи с id до 100 (псевдослучайный фильтр).";
        }
    }

    function renderTodos(todos) {
        todoList.innerHTML = "";

        if (!todos.length) {
            const li = document.createElement("li");
            li.textContent = "Нет задач для отображения.";
            li.classList.add("todo-item");
            todoList.appendChild(li);
            return;
        }

        todos.forEach((todo) => {
            const li = document.createElement("li");
            li.classList.add("todo-item");
            if (todo.completed) {
                li.classList.add("todo-item--done");
            }

            const titleSpan = document.createElement("span");
            titleSpan.textContent = todo.title;

            const statusSpan = document.createElement("span");
            statusSpan.classList.add("todo-item__status");
            statusSpan.textContent = todo.completed ? "выполнено" : "в процессе";

            li.appendChild(titleSpan);
            li.appendChild(statusSpan);

            todoList.appendChild(li);
        });
    }

    function applyFilter(allTodos) {
        let filtered = allTodos;

        if (filterMode === "high") {
            filtered = allTodos.filter(
                (t) => t.id > 100 && t.id <= 200
            );
        } else {
            filtered = allTodos.filter(
                (t) => t.id <= 100
            );
        }

        return filtered.slice(0, 10);
    }

    async function loadTodos() {
        try {
            preloader.classList.remove("hidden");
            errorBlock.textContent = "";
            todoList.innerHTML = "";
            filterInfo.textContent = "Загружаю задачи с сервера...";

            const response = await fetch(TODO_URL);

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }

            const data = await response.json();

            const filteredTodos = applyFilter(data);
            updateFilterInfo();
            renderTodos(filteredTodos);
        } catch (error) {
            console.error("Ошибка при загрузке задач:", error);
            errorBlock.textContent = "⚠ Что-то пошло не так. Попробуйте обновить страницу.";
        } finally {
            preloader.classList.add("hidden");
        }
    }

    loadTodos();
});