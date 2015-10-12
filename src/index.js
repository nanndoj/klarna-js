'use strict';

import View from './view';

window.onload = function () {
  // Render the view
  let view = new View();
  view.renderModel(document.getElementById('container2'));
};