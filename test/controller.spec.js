import { describe, it } from 'mocha';
import { expect } from 'chai';
import Controller from '../src/controller';

describe('Controller', () => {
  let ctrl = new Controller();

  it('Should be able to initialize a controller', () => {
    ctrl.init();
    expect(ctrl.model.rows).to.not.be.undefined;
    expect(ctrl.model.max).to.be.equal(1);
  });

  it('Should be able to add new boxes to existing rows', () => {
    ctrl.createBox(0,1);
    expect(ctrl.model.max).to.be.equal(2);

    ctrl.createBox(0,2);
    expect(ctrl.model.max).to.be.equal(3);
  });

  it('Should create a new row when overflow', () => {
    ctrl.createBox(0,1);
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