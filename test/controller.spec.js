import { describe, it } from 'mocha';
import { expect } from 'chai';
import Controller from '../src/js/controller';

describe('Controller', () => {
  
  it('Should be able to initialize a controller', () => {
    let ctrl = new Controller();
    ctrl.init();
    expect(ctrl.model.rows).to.not.be.undefined;
    expect(ctrl.model.max).to.be.equal(1);
  });

  it('Should be able to add new boxes to existing rows', () => {
    let ctrl = new Controller();
    ctrl.init();
    ctrl.createBox(0,1);
    expect(ctrl.model.max).to.be.equal(2);

    ctrl.createBox(0,2);
    expect(ctrl.model.max).to.be.equal(3);
  });

  it('Should create a new row when overflow', () => {
    let ctrl = new Controller();
    ctrl.init();
    ctrl.createBox(0,1);
    ctrl.createBox(0,1);
    ctrl.createBox(0,2);
    expect(ctrl.model.rows.length).to.be.equal(2);
    expect(ctrl.model.rows[1].capacity).to.be.equal(2);
  });

  it('Should be able to remove items', () => {
    let ctrlRemove = new Controller();
    ctrlRemove.init();
    // Add 4 items for testing
    for (let i = 0; i < 5; i++) {
      ctrlRemove.createBox(0,1);
    }
    // Should remove the last row
    ctrlRemove.removeBox(0,2);
    expect(ctrlRemove.model.rows.length).to.be.equal(2);

  });
});