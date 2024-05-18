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
function appendTodo(todo) {
  return `<li data-todo-label=${todo.label} class="flex-grow flex-shrink-0 basis-full bg-slate-400 p-2 rounded">
            <p class="font-bold">Titre: ${todo.label}</p>
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
        <div class="flex flex-col gap-2">
           <label class="text-center" for="end_date">Date de fin</label>
           <input type="datetime-local" name="end_date" min=${setMinTodoISODate(new Date().toISOString())} id="start" class="p-2  border-black border" />
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
        <ul class="todos-list flex flex-1 flex-wrap gap-3">${todos
          .map((d) => {
            return `<li data-todo-label=${d.label} class="flex-grow flex-shrink-0 basis-full bg-slate-400 p-2 rounded">
                        <p class="font-bold">Titre: ${d.label}</p>
                        <div class="flex flex-row">
                           <p class="flex-1">${d.description}</p>  <button class="hover:scale-75"aria-label="Delete" data-todo-delete="${d.label}">❌</button>
                        </div>
                  </li>`;
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
      end_date: new Date(formData.get("end_date")).toISOString(),
      description: formData.get("description"),
    };
    const { status } = await addTodo(payload);
    if (status === 201) {
      todos.push(payload);
      const todo_list = document.querySelector(".todos-list");
      todo_list.insertAdjacentHTML("beforeend", appendTodo(payload));
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

window.addEventListener("DOMContentLoaded", () => init.render());
