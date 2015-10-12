'use strict';
/**
 * This class represents a Row model  
 */
export default class Row {
  /**
  * @constructor
  * @param {int} size - The row capacity
  * @param {array} items - (Optional) The values to initialize this row.
  */
  constructor(size, items) {
    this.capacity = size;
    this.items = items || [];
  }

  /**
  * Create a new box to this row and control the row capacity
  * @param {int} boxNumber - The new box number.
  * @param {int} afterNum - Place the new box after this box number.
  * @returns {int} Returns a box number in case of overflow and returns undefined when ok
  */
  createBox(boxNumber, afterNumber) {
  	// if afterNumber value was given
    if(afterNumber && afterNumber > 0) {
      // Insert the new boxNumber at the index position
      let index = this.items.indexOf(afterNumber);
      this.items.splice((index + 1), 0, boxNumber);
    } else {
      // Just insert at the begining
      this.items.unshift(boxNumber);
    }

    // Check if the row is over capacity
    if(this.items.length > this.capacity) {
      // I'm full, give this to another row please
      return this.items.pop();
    }
  }
}