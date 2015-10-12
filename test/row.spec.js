import { describe, it } from 'mocha';
import { expect } from 'chai';
import Row from '../src/row';

describe('Row', () => {

  it('Should be able initialize rows with a set of boxes', () => {
    let row = new Row(3, [1,2,3]);
    expect(row.items.length).to.be.equal(3);

    var overflow = row.createBox(2,5);
    expect(row.items.length).to.be.equal(3);
    expect(overflow).to.be.equal(3);
  });

  it('Should be able to add new rows', () => {
    let row = new Row(3);
    row.createBox(1);
    expect(row.items.length).to.be.equal(1);

    row.createBox(2,1);
    expect(row.items.length).to.be.equal(2);

    row.createBox(3,2);
    expect(row.items.length).to.be.equal(3);
  });

  it('Should not allow exceed the row capacity', () => {
    let row = new Row(3);
    row.createBox(1);
    row.createBox(2,1);
    row.createBox(3,2);
    row.createBox(4,3); // Add a fourth box
    expect(row.items.length).to.be.equal(3);
  });

  it('Should remove and return the last box when overflow', () => {
    let row = new Row(3);
    row.createBox(1);
    row.createBox(2,1);
    row.createBox(3,2);
    const boxNum = row.createBox(5,3);
    expect(boxNum).to.be.equal(5);
  });

});