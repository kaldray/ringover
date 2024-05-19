import "./style.css";
import { getTodos, addTodo, removeTodo } from "#api/index.js";

let todos;

/**
 * @param {String} date
 * @returns {Date}
 */
function setMinTodoISODate(date) {
  return date.split(".").at(0);
}

/**
 *
 * @param {Object} todo
 * @returns
 */
function create_todo(todo) {
  return `<li data-todo-label=${todo.label} class="flex-grow flex-shrink-0 basis-full bg-slate-400 p-2 rounded">
            <div class="flex flex-row gap-2">
              <p class="font-bold">Titre: ${todo.label}</p>
              <span>Début:  ${new Intl.DateTimeFormat("fr-FR").format(new Date(todo.start_date))}</span>
            </div>
            <div class="flex flex-row">
               <p class="flex-1">${todo.description}</p>  <button class="hover:scale-75" aria-label="Delete" data-todo-delete="${todo.label}">❌</button>
            </div>
        </li>`;
}

const init = (function init() {
  const root = document.querySelector("#app");
  const form = `
  <section class="flex justify-center items-center mt-5">
     <form>
       <section class="flex flex-col justify-center items-center gap-3">
        <h1 class="text-lg mb-5">Ajouter des todos</h1>
         <div class="flex flex-col gap-2">
           <label class="text-center" for="title">Titre</label>
           <input type="text" name="title" id="title" class="p-2  border-black border" />
         </div>
         <div class="flex flex-col gap-2">
           <label class="text-center" for="description">Description</label>
           <input type="text" name="description" id="description" class="p-2  border-black border" />
         </div>
        <div class="flex flex-col gap-2">
           <label class="text-center" for="start_date">Date de début</label>
           <input type="datetime-local" name="start_date" min=${setMinTodoISODate(new Date().toISOString())} id="start" class="p-2  border-black border" />
         </div>
         <button type="submit" id="submit-todo" class="border-2 p-2 border-black rounded-md">Ajouter</button>
       </section>
     </form>
  </section>
   `;
  const nav = `
        <nav class="bg-[#25C9D5] p-4">
            <p>Ringover Todo</p>
        </nav>
    `;

  const app_logic = {
    addTodo: add,
    removeTodo: remove,
    search: search,
  };

  function render() {
    root.insertAdjacentHTML("beforebegin", nav);
    root.insertAdjacentHTML("afterbegin", form);
    afterRender();
  }

  async function afterRender() {
    todos = await getTodos();
    main.render();
    app_logic.addTodo();
    app_logic.removeTodo();
    app_logic.search();
  }

  return { render };
})();

const main = (function main() {
  const root = document.querySelector("#app");
  async function render() {
    const todos_section =
      todos.length === 0 ?
        `
    <section class="mx-auto w-4/5 my-5 todos-container">
        <p>Vous n'avez aucune todos !</p>
    </section>
      `
      : `<section class="mx-auto w-4/5 my-5">
          <div class="mb-3">
            <form>
              <div class="flex flex-col">
                <label for="search-todos">Trier les todos</label>
                  <input class="p-2 border border-black" type="text" name="search-todos" id="search-todos" />
                  <select></select>
              </div>
            </form>
          </div>
          <ul class="todos-list flex flex-1 flex-wrap gap-3">${todos
            .map((d) => {
              return create_todo(d);
            })
            .join("")}
          </ul>
    </section>`;
    root.insertAdjacentHTML("beforeend", todos_section);
  }
  return { render };
})();

function add() {
  const submit_button = document.querySelector("#submit-todo");
  submit_button.addEventListener("click", async (e) => {
    e.preventDefault();
    const form = document.querySelector("form");
    const formData = new FormData(form);
    const payload = {
      label: formData.get("title"),
      start_date: new Date(formData.get("start_date")).toISOString(),
      description: formData.get("description"),
    };
    const { status } = await addTodo(payload);
    if (status === 201) {
      todos.push(payload);
      const todo_list = document.querySelector(".todos-list");
      todo_list.insertAdjacentHTML("beforeend", create_todo(payload));
    }
  });
}

function remove() {
  const todos_list = document.querySelector(".todos-list");
  todos_list.addEventListener("click", async (e) => {
    const todo_to_delete = e.target.dataset.todoDelete ?? null;
    if (todo_to_delete) {
      const { status } = await removeTodo(todo_to_delete);
      if (status === 200) {
        const todo_html = document.querySelector(`[data-todo-label=${todo_to_delete.toString()}]`);
        todo_html.remove();
      }
    }
  });
}

function search() {
  const search = document.querySelector("#search-todos");
  const todos_list = document.querySelector(".todos-list");
  search.addEventListener("input", (e) => {
    const filtered_todos = todos.filter((todo) =>
      todo.label.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    Array.from(todos_list.children).forEach((elem) => elem.remove());
    todos_list.insertAdjacentHTML(
      "afterbegin",
      filtered_todos
        .map((d) => {
          return create_todo(d);
        })
        .join(""),
    );
  });
}

window.addEventListener("DOMContentLoaded", () => init.render());
