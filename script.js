'use strict';

const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_ID_LIST_KEY = 'task.selectedListId';
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedList = localStorage.getItem(LOCAL_STORAGE_SELECTED_ID_LIST_KEY);

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
  return { id: Date.now().toString(), name: name, tasks: [] };
}
// This is going to give us a unique identifier, cause it's gonna be based on the current time that user run this operation

function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
}
// We want to stringify our list here, we'll say json.strify(lists) and this is gonna save that information in our local storage. We also need to make sure we specify what key were using.

function render() {
  clearElement(listsContainer);
  lists.forEach(list => {
    const listElement = document.createElement('li');
    listElement.dataset.listId = list.id;
    listElement.classList.add('list-name');
    listElement.innerText = list.name;
    listsContainer.appendChild(listElement);
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();
