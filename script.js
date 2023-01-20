'use strict';

const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListButton = document.querySelector('[data-delete-list-button]');
const listDisplayContainer = document.querySelector(
  '[data-list-display-container]'
);
const listTitleElement = document.querySelector('[data-list-title]');
const listCountElement = document.querySelector('[data-list-count]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task-template');
const newTaskForm = document.getElementById('[data-new-task-form]');
const newTaskInput = document.getElementById('[data-new-task-input]');

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_ID_LIST_KEY = 'task.selectedListId';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_ID_LIST_KEY);

listsContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'li') {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});

tasksContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'input') {
    const selectedList = lists.find(list => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(
      task => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    // check it, or uncheck it, true or false depending on if it's checked or not.
    save();
    renderTaskCount(selectedList);
  }
  //Compare our task id to our checkbox id. If someone mathces, that's gonna be the task that we just clicked as done.
});

deleteListButton.addEventListener('click', e => {
  lists = lists.filter(list => list.id !== selectedListId);
  selectedListId = null;
  saveAndRender();
});
// We want to do it whenever we click this button, we want to delete the list that currently selected. As long as the list ID doesn't equal the actual current selected list ID, give me all the lists that are not the one we have selected. Those will be on new list.
// Then we want to take our selected list and we want to set this equal to null, because we no longer have a selected list.
// Call the saveAndRender() so we can rerender entire page.

newListForm.addEventListener('submit', e => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName === '') return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  saveAndRender();
});

// newTaskForm.addEventListener('submit', e => {
//   e.preventDefault();
//   const taskName = newTaskInput.value;
//   if (taskName == null || taskName === '') return;
//   const task = createTask(taskName);
//   newTaskInput.value = '';
//   const selectedList = lists.find(list => list.id === selectedListId);
//   selectedList.tasks.push(task);
//   saveAndRender();
// });

function createList(name) {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  };
}
// Unique id, cause it's gonna be based on the current time that user run this operation

function createTask(name) {
  return {
    id: Date.now().toString(),
    name: name,
    complete: false,
  };
}

function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_ID_LIST_KEY, selectedListId);
}
// This is gonna save that information in our local storage. Make sure to specify what key were using.

function render() {
  clearElement(listsContainer);
  renderLists();

  const selectedList = lists.find(list => list.id === selectedListId);

  if (selectedListId == null) {
    listDisplayContainer.style.display = 'none';
  } else {
    listDisplayContainer.style.display = '';
    listTitleElement.innerText = selectedList.name;
    renderTaskCount(selectedList);
    clearElement(tasksContainer);
    renderTasks(selectedList);
  }
  // If we don't have selected list, will display nothing, but when we do have selected list we want to appear the task section.
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.contentEditable, true);
    const checkbox = taskElement.querySelector('input');
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector('label');
    label.htmlFor = task.id;
    label.append(task.name);
    tasksContainer.appendChild(taskElement);
  });
  //Clone our tasks, and we need to pass true to get everything inside of template
}

function renderTaskCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(
    task => !task.complete
  ).length;
  // Get number of the tasks that not complete
  const taskString = incompleteTaskCount === 1 ? 'task' : 'tasks';
  // if we have only one task left use the 'task' word, if it's not, use 'tasks'.
  listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

function renderLists() {
  lists.forEach(list => {
    const listElement = document.createElement('li');
    listElement.dataset.listId = list.id;
    listElement.classList.add('list-name');
    listElement.innerText = list.name;
    if (list.id === selectedListId) {
      listElement.classList.add('active-list');
    }
    // If the list ID that we have is equal to the selected
    listsContainer.appendChild(listElement);
  });
  // render function always going to change the class for us
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();
