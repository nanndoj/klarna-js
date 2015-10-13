'use strict';

import Controller from './controller';
/**
 * This class represents a fluibox view and  
 * it is responsible for manipulate the page
 * DOM acording to the controler definitions
 */
export default class View {
  /**
  * @constructor
  */
  constructor() {
    this.container;

    // Save a refference to controller
    this.controller = new Controller();
    this.controller.init();
   
    this.itemCount = 1;
    this.session = {
      visible : 0, // Number of visible boxes on page
      removed : 0 // Number of removed boxes
    };

    // Add init listeners
    this.registerInitListeners();
  }
  
  /**
  * Repaint the whole view area
  * @param {int} container - DOM element where the model should be rendered
  */
  renderModel(container) {
    // Store the DOM container
    this.container = container;
    this.itemCount = 1;

    // clear the container
    this.container.innerHTML = '';
    
    // Reset statistics before render
    this.session.visible = 0;

    // Start rendering
    let rows = this.controller.model.rows;
    rows.forEach((row, i) => {
      // render the row items
      this.container.appendChild(this.renderRow(row,i));
    });

    this.renderStatistics();
  }

  /**
  * Render a specific row
  * @param {int} row - The row model
  * @param {int} index - The row index (zero based)
  */
  renderRow(row, index) {
    // Create a new div for the row
    let HTMLRow = document.createElement('div');
    HTMLRow.id = `row-${index}`;
    HTMLRow.className = `row ${this.getClassModifiers(this.controller.model.rows, row,index)}`;

    // Loop through the row items
    row.items.forEach((item, i, rows) => {
      // Get the left and right neighbors
      var leftNeighbor = rows[i - 1] || '';
      var rightNeighbor = rows[i + 1] || '';

      // Render a single box
      HTMLRow.appendChild(this.renderBox({
        boxNumber : item, 
        rowIndex : index,
        boxIndex : i,
        neighborL : leftNeighbor,
        neighborR : rightNeighbor,
      }));

      this.session.visible++;
    });

    return HTMLRow;
  }

  /**
  * Get the css class that should be associated to the box container
  * based on some of the box model info
  * @param {int} rows - The whole list of rows
  * @param {int} row - The row model
  * @param {int} index - The row index (zero based) 
  * @returns {string} the value ready for the 'class' attribute
  */
  getClassModifiers(rows, row, index) {
    
    // Fist and last modifiers
    let modifiers = '';
    if(index == 0) {
      modifiers = 'first';
    } else if(index == (rows.length - 1)) {
      modifiers = 'last';
    }

    // capacity modifiers
    switch(row.capacity) {
    case 3:
      modifiers += ' one-third';
      break;
    case 2:
      modifiers += ' one-half';
      break;
    case 1:
      modifiers += ' full';
      break;
    }

    return modifiers;
  }

  /**
  * Render a specific box
  * @param {object} boxModel - Object containing the box data to be rendered
  * @returns {int} index - The row index (zero based)
  */
  renderBox(boxModel) {
    // Column
    let col = document.createElement('div');
    col.className = 'col';

    // Box
    let box = document.createElement('div');
    box.className = 'box';

    const position = this.itemCount++;

    if(position % 4 === 2) {
      box.className = 'box second';      
    }

    if(position % 4 === 3) {
      box.className = 'box third';      
    }

    if(position % 4 === 0) {
      box.className = 'box fourth';      
    }

    box.id = `box-${boxModel.boxNumber}`;

    // Box header
    let header = document.createElement('div');
    header.className = 'box-header';
    header.innerHTML = `<span class="title">${boxModel.boxNumber}</span>`;
    
    // Close button
    let close = document.createElement('span');
    close.className = 'icon';
    close.dataset.box = boxModel.boxNumber;
    close.dataset.index = boxModel.boxIndex;
    close.dataset.row = boxModel.rowIndex;
    close.innerHTML = 'x';

    close.addEventListener('click',(evt) => {
      // Call the controller to remove a box
      const data = evt.target.dataset;
      this.controller.removeBox(parseInt(data.row), parseInt(data.index));
      
      this.session.removed++;

      this.renderModel(this.container);

      evt.stopPropagation();
      evt.preventDefault();

    });
    header.appendChild(close);

    box.appendChild(header);

    // Box content
    let content = document.createElement('div');
    content.className = 'box-content';
    content.innerHTML = `<div class="box-meta">
                          <span class="left">${boxModel.neighborL}</span>
                          <span class="right">${boxModel.neighborR}</span>
                         </div>`;

    box.appendChild(content);

    col.appendChild(box);

    this.attachEvents(col);

    return col;
  }

  attachEvents(element) {
    // Add mouseenter event listener
    element.addEventListener('mouseenter', (evt) => {
      this.container.setAttribute('class', 'container active');
      this.container.parentNode.setAttribute('class', 'container active');
    });

    // Add mousout event listener
    element.addEventListener('mouseleave', (evt) => {
      this.container.setAttribute('class', 'container');
      this.container.parentNode.setAttribute('class', 'container');
    });

    // Add click event listener
    element.addEventListener('click', (evt) => {
      let target = evt.target;
      
      // find the parent row
      let parent = target;
      let boxNumber;
      while(parent && parent.className.indexOf('row') == -1) {
        parent = parent.parentNode;

        // We also look for the box number
        if(parent.className.indexOf('box') !== -1) {
          boxNumber = parseInt(parent.id.replace('box-',''));
        }
      }

      const rowIndex = parseInt(parent.id.replace('row-',''));

      this.controller.createBox(rowIndex, boxNumber);

      this.renderModel(this.container);
    });
  }

  renderStatistics() {
    document.getElementById('visible').innerHTML = this.session.visible;
    document.getElementById('removed').innerHTML = this.session.removed;
  }

  registerInitListeners() {
    document.getElementById('clear').addEventListener('click',(evt) => {
      this.resetState();
    });
  }

  resetState() {
    this.itemCount = 1;
    this.session = {
      visible : 0, // Number of visible boxes on page
      removed : 0 // Number of removed boxes
    };

    if(typeof(Storage) !== 'undefined') {
      // Clear the local storage
      localStorage.removeItem('klarnaSaved');  
    } else {
      // Local storage is not available
    }
    this.controller = new Controller();
    this.controller.init();
    this.renderModel(this.container);
  }
}