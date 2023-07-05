"use strict";

import './style.scss';
import Game from './src/Game';

const canvas = document.createElement('canvas');
const usernameForm = document.getElementById('usernameForm');

let gameInstance;
function init() {
  canvas.width = window.innerWidth - 2;
  canvas.height = window.innerHeight - 2;
  canvas.tabIndex = "1";

  document.body.appendChild(canvas);

  usernameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = e.target.elements[0].value;
    gameInstance = new Game(username, canvas);

    window.addEventListener('keydown', e => {
      if(e.key === 'Escape') gameInstance.stop();
    })

    console.log(gameInstance);
    if(gameInstance.init()){
      console.log('Init done');
      canvas.focus();
      usernameForm.elements[0].classList.remove('invalid');
      usernameForm.parentElement.classList.add('done');
    }else {
      console.error('Init failed');
      usernameForm.elements[0].classList.add('invalid');
    }
  })
}

init();