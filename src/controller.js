'use strict';

import Row from './row';
/**
 * This class represents a fluibox controller  
 * the main point between models and views.
 * This class stores all logic between our model
 * and views
 */
export default class Controller {
  /**
  * @constructor
  */
  constructor() {
    this.model = {
      max : 1,
      nextSize : 2,
      rows : []
    };
  }
  
  /**
  * Initializes a controller and try to load
  * any saved data on the local storage
  */
  init() {
    // try to get the storage if exist
    let storage;
    try {
      storage = window.localStorage;
    } catch(ex) {
      storage = {};
    }

    // Check if there's something on the local storage
    if(storage.klarnaSaved) {
      this.model = Object.assign(JSON.parse(storage.klarnaSaved));
      this.model.rows.forEach((row, index) => {
        this.model.rows[index] = new Row(row.capacity, row.items);
      });

      // calculate the nextCapacity
      this.model.nextSize = (this.model.rows[this.model.rows.length - 1].capacity - 1);
    } else {
      // Create a new Row with 3 of capacity
      let row = new Row(3);
      // Create a new box with number one
      row.createBox(1);

      // append the new created row to the model
      this.model.rows.push(row);
    }
  }

  /**
  * Create a new box to the model
  * @param {int} rowIndex - The row index (zero based).
  * @param {int} afterNum - Place the new box after this box number.
  * @param {boxNumber} boxNumber - The new box number.
  */
  createBox(rowIndex, afterNum, boxNumber) {
    // get the row we want to add
    let row = this.model.rows[rowIndex];

    // Get the box number
    boxNumber = boxNumber || ++this.model.max;

    // Create a new box
    const overflow = row.createBox(boxNumber, afterNum);

    // If there's an overflow
    if(overflow) {
      // if we run out of rows. Create a new one
      const newIndex = ++rowIndex;       

      if(newIndex >= this.model.rows.length) {
        // Create a new row
        this.createRow();
      }

      // Try adding to the next row
      this.createBox(newIndex, null, overflow);
    }

    // save it on local storage for later use
    this.persistModel();
  }

  /**
  * Remove a box from the model
  * @param {int} rowIndex - The row index (zero based).
  * @param {boxIndex} boxNumber - The new box index (zero based).
  */
  removeBox(rowIndex, boxIndex) {
    // get the row we want to remove
    let row = this.model.rows[rowIndex];
    // Remove a box from the row
    row.items.splice(boxIndex, 1); 

    /**
    * Reorganize the model
    */
    let reorganize = (rowIndex) => {
      if(rowIndex < (this.model.rows.length - 1)) {
        // get the row index for the next row
        const nextIndex = rowIndex + 1;
        let nextItems = this.model.rows[nextIndex].items;
      
        // Push the first item from the last row
        this.model.rows[rowIndex].items.push(nextItems.shift());

        if(nextItems.length == 0 && nextIndex == (this.model.rows.length - 1)) {
          // Remove the last row
          this.model.rows.pop();
          this.model.nextSize = (this.model.rows[this.model.rows.length - 1].capacity - 1);

          if(this.model.nextSize === 0) {
            this.model.nextSize = 3;
          }
        } else {
          reorganize(nextIndex);
        }
      } else if((rowIndex === (this.model.rows.length - 1)) && this.model.rows[rowIndex].items.length === 0) {
        this.model.rows.pop();
      }
    };

    reorganize(rowIndex);

    // save the model on local storage for later use
    this.persistModel();
  }

  /**
  * Create a new empty row
  */
  createRow() {

    this.model.rows.push(new Row(this.model.nextSize--));

    if(this.model.nextSize === 0) {
      this.model.nextSize = 3;
    }
  }

  /**
  * Persist the current model in the localStorage
  */
  persistModel() {
    if(typeof(Storage) !== 'undefined') {
      localStorage.setItem('klarnaSaved', JSON.stringify(this.model));
    } else {
        // Sorry! No Web Storage support..
        // It could be stored in a file
        // but we need to make a request
        // to a server side code
    }
  }
}