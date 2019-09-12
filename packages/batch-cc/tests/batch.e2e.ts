// tslint:disable:no-unused-expression
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import 'mocha';

import { CouchDBStorage } from '@worldsibu/convector-storage-couchdb';
import { FabricControllerAdapter } from '@worldsibu/convector-platform-fabric';
import { BaseStorage, ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';

import { Batch, BatchController } from '../src';

describe('Batch', () => {
  let adapter: FabricControllerAdapter;
  let batchCtrl: ConvectorControllerClient<BatchController>;

  before(async () => {
      adapter = new FabricControllerAdapter({
        skipInit: true,
        txTimeout: 300000,
        user: 'user1',
        channel: 'ch1',
        chaincode: 'batch',
        keyStore: '$HOME/hyperledger-fabric-network/.hfc-org1',
        networkProfile: '$HOME/hyperledger-fabric-network/network-profiles/org1.network-profile.yaml',
        userMspPath: '$HOME/hyperledger-fabric-network/artifacts/crypto-config/peerOrganizations/org1.hurley.lab/users/User1@org1.hurley.lab/msp',
        userMsp: 'org1MSP'
      });
      batchCtrl = ClientFactory(BatchController, adapter);
      await adapter.init(true);

      BaseStorage.current = new CouchDBStorage({
        host: 'localhost',
        protocol: 'http',
        port: '5084'
      }, 'ch1_batch');
  });

  after(() => {
    // Close the event listeners
    adapter.close();
  });

  it('should create a default model', async () => {
    const modelSample = new Batch({
      id: uuid(),
      name: 'Test',
      created: Date.now(),
      modified: Date.now()
    });

    await batchCtrl.create(modelSample);

    const justSavedModel = await Batch.getOne(modelSample.id);
    expect(justSavedModel.id).to.exist;
  });
});