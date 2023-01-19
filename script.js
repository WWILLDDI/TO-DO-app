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

function createList(name) {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  };
}
// Unique id, cause it's gonna be based on the current time that user run this operation

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
