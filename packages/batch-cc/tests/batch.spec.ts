// tslint:disable:no-unused-expression
import { join } from 'path';
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import { ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';
import 'mocha';

import { Batch, BatchController } from '../src';

describe('Batch', () => {
  let adapter: MockControllerAdapter;
  let batchCtrl: ConvectorControllerClient<BatchController>;
  
  before(async () => {
    // Mocks the blockchain execution environment
    adapter = new MockControllerAdapter();
    batchCtrl = ClientFactory(BatchController, adapter);

    await adapter.init([
      {
        version: '*',
        controller: 'BatchController',
        name: join(__dirname, '..')
      }
    ]);

    adapter.addUser('Test');
  });
  
  it('should create a default model', async () => {
    const modelSample = new Batch({
      id: uuid(),
      name: 'Test',
      created: Date.now(),
      modified: Date.now()
    });

    await batchCtrl.$withUser('Test').create(modelSample);
  
    const justSavedModel = await adapter.getById<Batch>(modelSample.id);
  
    expect(justSavedModel.id).to.exist;
  });
});