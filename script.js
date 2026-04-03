const form = document.getElementById('todoform');
const todoInput = document.getElementById('newtodo');
const todosListEl = document.getElementById('todos-list');
const BASE_URL = "http://localhost:3001";
let todos = [];
let EditTodoId = null;

async function getTodos() {
  const res = await fetch(`${BASE_URL}/todos`);
  todos = await res.json();
  renderTodos();
}

getTodos();

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const todoValue = todoInput.value;
  if (!todoValue) return;

  if (EditTodoId) {
    await fetch(`${BASE_URL}/todos/${EditTodoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: todoValue })
    });
    EditTodoId = null;
  } else {
      await fetch(`${BASE_URL}/todos`, {      
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        value: todoValue,
        checked: false,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      })
    });
  }
  todoInput.value = '';
  getTodos();
});

function renderTodos() {
  todosListEl.innerHTML = '';

  if (todos.length === 0) {
    todosListEl.innerHTML = '<center>Nothing to do!</center>';
    return;
  }

  todos.forEach((todo) => {
    todosListEl.innerHTML += `
    <div class="todo" data-id="${todo._id}">
      <i class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}" 
         style="color:${todo.color}" data-action="check"></i>
      <p class="${todo.checked ? 'checked' : ''}" data-action="check">${todo.value}</p>
      <i class="bi bi-pencil-square" data-action="edit"></i>
      <i class="bi bi-trash" data-action="delete"></i>
    </div>
    `;
  });
}

todosListEl.addEventListener('click', async (event) => {
  const parent = event.target.parentNode;
  if (!parent.classList.contains('todo')) return;

  const id = parent.dataset.id;
  const action = event.target.dataset.action;

  if (action === 'check') {
    const todo = todos.find(t => t._id === id);

    await fetch(`${BASE_URL}/todos/${id}`, {     
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...todo, checked: !todo.checked })
    });

  } else if (action === 'edit') {
    const todo = todos.find(t => t._id === id);
    todoInput.value = todo.value;
    EditTodoId = id;

  } else if (action === 'delete') {
    await fetch(`${BASE_URL}/todos/${id}`, {    
    method: 'DELETE'
    });
  }

  getTodos();
});