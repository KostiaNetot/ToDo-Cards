'use strict';

function Task(name, state, prior) {
  this.name = name;
  this.state = state;
  this.priority = prior;
}