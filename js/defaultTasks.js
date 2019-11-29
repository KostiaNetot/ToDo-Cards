'use strict';

let myToDoList = [];
let defaultData;
let starCount;

const checkLocalStorage = () => {
  if (!localStorage.getItem('my-todo')) {
    setDefaultData();
  } else {
    myToDoList = JSON.parse(localStorage.getItem('my-todo'));
    createStartList(myToDoList);
  }
}

function createStartList(arr) {
  for (let task of arr) {
    let newTask = new Task(task.name, task.state, task.priority);
    let resultKey = getKeyByName(defaultData, 'priority', task.priority);
    let statusColor = getColorByState(defaultData, 'state', task.state);

    createTaskCard({
      name: newTask.name,
      state: newTask.state,
      priority: newTask.priority,
      stars: resultKey,
      cardColor: statusColor
    });
  }
}

const setDefaultData = () => {
    let stateValue = getValuesFromData(defaultData, 'state', 'open');
    let priorValue = getValuesFromData(defaultData, 'priority', 3);
    let taskNameValues = getValuesFromData(defaultData, 'default-tasks', null);
    let statusColor = getColorByState(defaultData, 'state', 'open');

    createDefaultList(taskNameValues, stateValue, priorValue, statusColor);
}

const createDefaultList = (arr, state, prior, color) => {
  for (let item of arr) {
    let newTask = new Task(item, state, prior);
    myToDoList.push(newTask);
    localStorage.setItem('my-todo', JSON.stringify(myToDoList));
    let resultKey = getKeyByName(defaultData, 'priority', prior);

    createTaskCard({
      name: newTask.name,
      state: newTask.state,
      priority: newTask.priority,
      stars: resultKey,
      cardColor: color
    });
  }
}