import * as yup from 'yup';
import {
  ConvectorModel,
  Default,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';

export class Batch extends ConvectorModel<Batch> {
  @ReadOnly()
  @Required()
  public readonly type = 'io.worldsibu.batch';

  @Required()
  @Validate(yup.string())
  public name: string;

  @ReadOnly()
  @Required()
  @Validate(yup.date())
  public createdAt: Date;

  @ReadOnly()
  @Required()
  @Validate(yup.string())
  public createdBy: string;

  @Validate(yup.date())
  public modifiedAt: Date;

  @ReadOnly()
  @Validate(yup.string())
  public modifiedBy: string;
}
