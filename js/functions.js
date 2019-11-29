'use strict';

const changePriority = (currentRating, $el) => {
  starCount = currentRating;
}

const createTaskCard = (options) => {
  let cardsWrapper = document.querySelector('.task-cards-wrapper');

  let taskCard = createElement({
    parent: cardsWrapper,
    tagName: 'div',
    className: options.cardColor,
    dataName: options.name
  });
  let cardHeader = createElement({
    parent: taskCard,
    tagName: 'div',
    className: 'card-header',
  });
  let cardRemover = createElement({
    parent: cardHeader,
    tagName: 'button',
    type: 'button',
    className: 'close',
    ariaLabel: 'Close',
    event: 'click',
    handler: removeTask
  });
  let btnX = createElement({
    parent: cardRemover,
    tagName: 'span',
    ariaHidden: 'true',
    innerText: '×'
  });
  let statePar = createElement({
    parent: cardHeader,
    tagName: 'p',
    className: 'state-descr',
    event: 'click',
    handler: appendSelect,
    innerText: `${options.state} status`
  });
  let cardBody = createElement({
    parent: taskCard,
    tagName: 'div',
    className: 'card-body'
  });
  let cardTitle = createElement({
    parent: cardBody,
    tagName: 'h5',
    className: 'card-title',
    innerText: `${options.name}`
  });
  let priorPar = createElement({
    parent: cardBody,
    tagName: 'p',
    className: 'card-text',
    innerText: `${options.priority} priority`
  });
  let priorStars = createElement({
    parent: cardBody,
    tagName: 'div',
    className: 'my-rating',
    event: 'click',
    handler: changeStars
  });

  $(".my-rating").starRating({
    starSize: 20,
    totalStars: 4,
    useFullStars: true,
    disableAfterRate: false,
    initialRating: options.stars,
    callback: (currentRating, $el) => {
      changePriority(currentRating, $el);
    }
  });
}

const getColorByState = (data, feature, val) => {
  let result;
  for (let item of data) {
    for (let key in item) {
      if (key === feature) {
        result = getFromInnerArr(item[key], val).color;
      }
    }
  }
  return result;
};

const getValuesFromData = (data, feature, val) => {
  let result;
  data.forEach((item, i, arr) => {
    for (let key in item) {
      if (feature !== 'default-tasks' && key === feature) {
        result = getFromInnerArr(item[key], val).name;
      }
      if (feature === 'default-tasks' && key === feature) {
        result = new Array();
        result = item[key];
      }
    }
  });
  return result;
}

const getKeyByName = (data, feature, name) => {
  let result;
  data.forEach((item, i, arr) => {
    for (let key in item) {
      if (key === feature) {
        result = getFromInnerArr(item[key], name);
      }
    }
  });
  return result.key;
}

const requestToData = () => {
  let myHeaders = new Headers({
    "Content-Type": "application/json",
  });
  let params = {
    method: 'GET',
    headers: myHeaders,
  };

  fetch('data.json', params)
    .then(function (res) {
      return res.json();
    })
    .then(function (res) {
      defaultData = res;
      checkLocalStorage();
    });
}

const getFromInnerArr = (arr, val) => {
  let result;
  arr.forEach((item, i, arr) => {
    for (let k in item) {
      if (item[k] === val) {
        result = {
          key: item['key'],
          name: item['name'],
          color: item['color']
        };
      }
    }
  });
  return result;
}

const setNewTask = () => {
  let newTaskForm = document.forms['newTask'];
  let newTaskName = newTaskForm['newTaskName'].value;
  let newTaskPrior = parseInt(newTaskForm['priorityFormSelect'].value);

  let stateValue = getValuesFromData(defaultData, 'state', 'open');
  let priorValue = getValuesFromData(defaultData, 'priority', newTaskPrior);
  let statusColor = getColorByState(defaultData, 'state', 'open');
  createNewTask(newTaskName, stateValue, priorValue, newTaskPrior, statusColor);
}

const createNewTask = (name, state, prior, stars, color) => {
  let newTask = new Task(name, state, prior);
  myToDoList.push(newTask);
  localStorage.setItem('my-todo', JSON.stringify(myToDoList));

  createTaskCard({
    name: newTask.name,
    state: newTask.state,
    priority: newTask.prior,
    cardColor: color,
    stars: stars
  });
}

const changeStars = (e) => {
  if (e.target.tagName === 'polygon') {
    let card = e.target.closest('.card');
    let cardDataName = card.getAttribute('data-name');
    let priorValue = getValuesFromData(defaultData, 'priority', starCount);
    let cardText = card.querySelector('.card-text');
    let objIndex;

    myToDoList.forEach((item, i, arr) => {
      for (let key in item) {
        if (item[key] === cardDataName) {
          objIndex = i;
        }
      }
    });

    myToDoList[objIndex]['priority'] = priorValue;
    localStorage.setItem('my-todo', JSON.stringify(myToDoList));
    cardText.innerText = `${priorValue} priority`;
  }
}

const appendSelect = (e) => {
  let stateDescr = e.target;
  let taskCard = e.target.closest('.card');
  let selectDraft = document.querySelector('.my-select');
  let mySelect = selectDraft.cloneNode(true);
      stateDescr.appendChild(mySelect);
      mySelect.classList.remove('hidden');

  $(mySelect).on('change', function() {
    changeState(taskCard, this.value, mySelect, stateDescr);
  });
}

const sendData = () => {
  const dataToSend = JSON.stringify(myToDoList);

  const xhrList = new XMLHttpRequest();

  xhrList.open('POST', 'data.php');
  xhrList.setRequestHeader("Content-Type", "application/json");

  xhrList.send(dataToSend);

  alert('Check data.php in Network tab');
}

const removeSelectInput = (mySelect, p, val) => {
  mySelect.remove();
  p.innerText = `${val} status`;
}

const changeState = (card, selVal, mySelect, p) => {
  let stateValue = getValuesFromData(defaultData, 'state', selVal);
  let cardDataName = card.getAttribute('data-name');
  let priorValue = getValuesFromData(defaultData, 'state', stateValue);
  let objIndex;
  let statusColor = getColorByState(defaultData, 'state', priorValue);

  myToDoList.forEach((item, i, arr) => {
    for (let key in item) {
      if (item[key] === cardDataName) {
        objIndex = i;
      }
    }
  });

  card.className = statusColor;
  myToDoList[objIndex]['state'] = priorValue;
  localStorage.setItem('my-todo', JSON.stringify(myToDoList));

  removeSelectInput(mySelect, p, priorValue);
}

const removeTask = (e) => {
  let taskCard = e.target.closest('.card');
  let cardData = taskCard.getAttribute('data-name');

  let objIndex;

  myToDoList.forEach((item, i, arr) => {
    for (let key in item) {
      if (item[key] === cardData) {
        objIndex = i;
      }
    }
  });

  myToDoList.splice(objIndex, 1);
  console.log(myToDoList);
  localStorage.setItem('my-todo', JSON.stringify(myToDoList));
  taskCard.remove();
}

const createElement = (options) => {
  let element = document.createElement(options.tagName);
  if ('className' in options) {
    element.setAttribute('class', options.className);
  }
  if ('innerText' in options) {
    element.innerText = options.innerText;
  }
  if ('type' in options) {
    element.setAttribute('type', options.type);
  }
  if ('ariaLabel' in options) {
    element.setAttribute('aria-label', options.ariaLabel);
  }
  if ('ariaHidden' in options) {
    element.setAttribute('aria-hidden', options.ariaHidden);
  }
  if ('dataName' in options) {
    element.setAttribute('data-name', options.dataName);
  }
  if ('event' in options) {
    element.addEventListener(options.event, options.handler);
  }
  options.parent.appendChild(element);
  return element;
}