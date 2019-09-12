import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import * as yup from 'yup';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';

import { Batch } from './batch.model';

@Controller('batch')
export class BatchController extends ConvectorController<ChaincodeTx> {
  @Invokable()
  public async create(
    @Param(Batch)
    batch: Batch
  ) {

    const exists = await Batch.getOne(batch.id);
    if (exists.id === batch.id) {
      throw new Error('There is already one batch with that unique id');
    }
    const {name, id, createdAt} = batch;
    const newBatch = new Batch({name, id, createdAt, createdBy: this.sender});
    await newBatch.save();

    return newBatch;
  }

  @Invokable()
  public async get(
    @Param(yup.string())
    id: string
  ) {
    const existing = await Batch.getOne(id);
    if (!existing || !existing.id) {
      throw new Error(`No batch exists with that ID ${id}`);
    }
    return existing;
  }

}