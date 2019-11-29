'use strict';

requestToData();

const btnSendList = document.getElementById('sendToDoList');
      btnSendList.addEventListener('click', sendData);

const btnSetNemTask = document.getElementById('btnSetNewTask');
      btnSetNemTask.addEventListener('click', setNewTask);