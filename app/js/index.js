(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _row = require('./row');

var _row2 = _interopRequireDefault(_row);

/**
 * This class represents a fluibox controller  
 * the main point between models and views.
 * This class stores all logic between our model
 * and views
 */

var Controller = (function () {
  /**
  * @constructor
  */

  function Controller() {
    _classCallCheck(this, Controller);

    this.model = {
      max: 1,
      nextSize: 2,
      rows: []
    };
  }

  /**
  * Initializes a controller and try to load
  * any saved data on the local storage
  */

  _createClass(Controller, [{
    key: 'init',
    value: function init() {
      var _this = this;

      // try to get the storage if exist
      var storage = undefined;
      try {
        storage = window.localStorage;
      } catch (ex) {
        storage = {};
      }

      // Check if there's something on the local storage
      if (storage.klarnaSaved) {
        this.model = Object.assign(JSON.parse(storage.klarnaSaved));
        this.model.rows.forEach(function (row, index) {
          _this.model.rows[index] = new _row2['default'](row.capacity, row.items);
        });

        // calculate the nextCapacity
        this.model.nextSize = this.model.rows[this.model.rows.length - 1].capacity - 1;
      } else {
        // Create a new Row with 3 of capacity
        var row = new _row2['default'](3);
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
  }, {
    key: 'createBox',
    value: function createBox(rowIndex, afterNum, boxNumber) {
      // get the row we want to add
      var row = this.model.rows[rowIndex];

      // Get the box number
      boxNumber = boxNumber || ++this.model.max;

      // Create a new box
      var overflow = row.createBox(boxNumber, afterNum);

      // If there's an overflow
      if (overflow) {
        // if we run out of rows. Create a new one
        var newIndex = ++rowIndex;

        if (newIndex >= this.model.rows.length) {
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
  }, {
    key: 'removeBox',
    value: function removeBox(rowIndex, boxIndex) {
      var _this2 = this;

      // get the row we want to remove
      var row = this.model.rows[rowIndex];
      // Remove a box from the row
      row.items.splice(boxIndex, 1);

      /**
      * Reorganize the model
      */
      var reorganize = function reorganize(rowIndex) {
        if (rowIndex < _this2.model.rows.length - 1) {
          // get the row index for the next row
          var nextIndex = rowIndex + 1;
          var nextItems = _this2.model.rows[nextIndex].items;

          // Push the first item from the last row
          _this2.model.rows[rowIndex].items.push(nextItems.shift());

          if (nextItems.length == 0 && nextIndex == _this2.model.rows.length - 1) {
            // Remove the last row
            _this2.model.rows.pop();
            _this2.model.nextSize = _this2.model.rows[_this2.model.rows.length - 1].capacity - 1;

            if (_this2.model.nextSize === 0) {
              _this2.model.nextSize = 3;
            }
          } else {
            reorganize(nextIndex);
          }
        } else if (rowIndex === _this2.model.rows.length - 1 && _this2.model.rows[rowIndex].items.length === 0) {
          _this2.model.rows.pop();
        }
      };

      reorganize(rowIndex);

      // save the model on local storage for later use
      this.persistModel();
    }

    /**
    * Create a new empty row
    */
  }, {
    key: 'createRow',
    value: function createRow() {

      this.model.rows.push(new _row2['default'](this.model.nextSize--));

      if (this.model.nextSize === 0) {
        this.model.nextSize = 3;
      }
    }

    /**
    * Persist the current model in the localStorage
    */
  }, {
    key: 'persistModel',
    value: function persistModel() {
      if (typeof Storage !== 'undefined') {
        localStorage.setItem('klarnaSaved', JSON.stringify(this.model));
      } else {
        // Sorry! No Web Storage support..
        // It could be stored in a file
        // but we need to make a request
        // to a server side code
      }
    }
  }]);

  return Controller;
})();

exports['default'] = Controller;
module.exports = exports['default'];

},{"./row":3}],2:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _view = require('./view');

var _view2 = _interopRequireDefault(_view);

window.onload = function () {
  // Render the view
  var view = new _view2['default']();
  view.renderModel(document.getElementById('container2'));
};

},{"./view":4}],3:[function(require,module,exports){
'use strict';
/**
 * This class represents a Row model  
 */
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Row = (function () {
  /**
  * @constructor
  * @param {int} size - The row capacity
  * @param {array} items - (Optional) The values to initialize this row.
  */

  function Row(size, items) {
    _classCallCheck(this, Row);

    this.capacity = size;
    this.items = items || [];
  }

  /**
  * Create a new box to this row and control the row capacity
  * @param {int} boxNumber - The new box number.
  * @param {int} afterNum - Place the new box after this box number.
  * @returns {int} Returns a box number in case of overflow and returns undefined when ok
  */

  _createClass(Row, [{
    key: 'createBox',
    value: function createBox(boxNumber, afterNumber) {
      // if afterNumber value was given
      if (afterNumber && afterNumber > 0) {
        // Insert the new boxNumber at the index position
        var index = this.items.indexOf(afterNumber);
        this.items.splice(index + 1, 0, boxNumber);
      } else {
        // Just insert at the begining
        this.items.unshift(boxNumber);
      }

      // Check if the row is over capacity
      if (this.items.length > this.capacity) {
        // I'm full, give this to another row please
        return this.items.pop();
      }
    }
  }]);

  return Row;
})();

exports['default'] = Row;
module.exports = exports['default'];

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _controller = require('./controller');

var _controller2 = _interopRequireDefault(_controller);

/**
 * This class represents a fluibox view and  
 * it is responsible for manipulate the page
 * DOM acording to the controler definitions
 */

var View = (function () {
  /**
  * @constructor
  */

  function View() {
    _classCallCheck(this, View);

    this.container;

    // Save a refference to controller
    this.controller = new _controller2['default']();
    this.controller.init();

    this.itemCount = 1;
    this.session = {
      visible: 0, // Number of visible boxes on page
      removed: 0 // Number of removed boxes
    };

    // Add init listeners
    this.registerInitListeners();
  }

  /**
  * Repaint the whole view area
  * @param {int} container - DOM element where the model should be rendered
  */

  _createClass(View, [{
    key: 'renderModel',
    value: function renderModel(container) {
      var _this = this;

      // Store the DOM container
      this.container = container;
      this.itemCount = 1;

      // clear the container
      this.container.innerHTML = '';

      // Reset statistics before render
      this.session.visible = 0;

      // Start rendering
      var rows = this.controller.model.rows;
      rows.forEach(function (row, i) {
        // render the row items
        _this.container.appendChild(_this.renderRow(row, i));
      });

      this.renderStatistics();
    }

    /**
    * Render a specific row
    * @param {int} row - The row model
    * @param {int} index - The row index (zero based)
    */
  }, {
    key: 'renderRow',
    value: function renderRow(row, index) {
      var _this2 = this;

      // Create a new div for the row
      var HTMLRow = document.createElement('div');
      HTMLRow.id = 'row-' + index;
      HTMLRow.className = 'row ' + this.getClassModifiers(this.controller.model.rows, row, index);

      // Loop through the row items
      row.items.forEach(function (item, i, rows) {
        // Get the left and right neighbors
        var leftNeighbor = rows[i - 1] || '';
        var rightNeighbor = rows[i + 1] || '';

        // Render a single box
        HTMLRow.appendChild(_this2.renderBox({
          boxNumber: item,
          rowIndex: index,
          boxIndex: i,
          neighborL: leftNeighbor,
          neighborR: rightNeighbor
        }));

        _this2.session.visible++;
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
  }, {
    key: 'getClassModifiers',
    value: function getClassModifiers(rows, row, index) {

      // Fist and last modifiers
      var modifiers = '';
      if (index == 0) {
        modifiers = 'first';
      } else if (index == rows.length - 1) {
        modifiers = 'last';
      }

      // capacity modifiers
      switch (row.capacity) {
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
  }, {
    key: 'renderBox',
    value: function renderBox(boxModel) {
      var _this3 = this;

      // Column
      var col = document.createElement('div');
      col.className = 'col';

      // Box
      var box = document.createElement('div');
      box.className = 'box';

      var position = this.itemCount++;

      if (position % 4 === 2) {
        box.className = 'box second';
      }

      if (position % 4 === 3) {
        box.className = 'box third';
      }

      if (position % 4 === 0) {
        box.className = 'box fourth';
      }

      box.id = 'box-' + boxModel.boxNumber;

      // Box header
      var header = document.createElement('div');
      header.className = 'box-header';
      header.innerHTML = '<span class="title">' + boxModel.boxNumber + '</span>';

      // Close button
      var close = document.createElement('span');
      close.className = 'icon';
      close.dataset.box = boxModel.boxNumber;
      close.dataset.index = boxModel.boxIndex;
      close.dataset.row = boxModel.rowIndex;
      close.innerHTML = 'x';

      close.addEventListener('click', function (evt) {
        // Call the controller to remove a box
        var data = evt.target.dataset;
        _this3.controller.removeBox(parseInt(data.row), parseInt(data.index));

        _this3.session.removed++;

        _this3.renderModel(_this3.container);

        evt.stopPropagation();
        evt.preventDefault();
      });
      header.appendChild(close);

      box.appendChild(header);

      // Box content
      var content = document.createElement('div');
      content.className = 'box-content';
      content.innerHTML = '<div class="box-meta">\n                          <span class="left">' + boxModel.neighborL + '</span>\n                          <span class="right">' + boxModel.neighborR + '</span>\n                         </div>';

      box.appendChild(content);

      col.appendChild(box);

      this.attachEvents(col);

      return col;
    }
  }, {
    key: 'attachEvents',
    value: function attachEvents(element) {
      var _this4 = this;

      // Add mouseenter event listener
      element.addEventListener('mouseenter', function (evt) {
        _this4.container.setAttribute('class', 'container active');
        _this4.container.parentNode.setAttribute('class', 'container active');
      });

      // Add mousout event listener
      element.addEventListener('mouseleave', function (evt) {
        _this4.container.setAttribute('class', 'container');
        _this4.container.parentNode.setAttribute('class', 'container');
      });

      // Add click event listener
      element.addEventListener('click', function (evt) {
        var target = evt.target;

        // find the parent row
        var parent = target;
        var boxNumber = undefined;
        while (parent && parent.className.indexOf('row') == -1) {
          parent = parent.parentNode;

          // We also look for the box number
          if (parent.className.indexOf('box') !== -1) {
            boxNumber = parseInt(parent.id.replace('box-', ''));
          }
        }

        var rowIndex = parseInt(parent.id.replace('row-', ''));

        _this4.controller.createBox(rowIndex, boxNumber);

        _this4.renderModel(_this4.container);
      });
    }
  }, {
    key: 'renderStatistics',
    value: function renderStatistics() {
      document.getElementById('visible').innerHTML = this.session.visible;
      document.getElementById('removed').innerHTML = this.session.removed;
    }
  }, {
    key: 'registerInitListeners',
    value: function registerInitListeners() {
      var _this5 = this;

      document.getElementById('clear').addEventListener('click', function (evt) {
        _this5.resetState();
      });
    }
  }, {
    key: 'resetState',
    value: function resetState() {
      this.itemCount = 1;
      this.session = {
        visible: 0, // Number of visible boxes on page
        removed: 0 // Number of removed boxes
      };

      if (typeof Storage !== 'undefined') {
        // Clear the local storage
        localStorage.removeItem('klarnaSaved');
      } else {
        // Local storage is not available
      }
      this.controller = new _controller2['default']();
      this.controller.init();
      this.renderModel(this.container);
    }
  }]);

  return View;
})();

exports['default'] = View;
module.exports = exports['default'];

},{"./controller":1}]},{},[2]);
