/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { ExternalReferences, Person, Url } from '@biosimulations/datamodel/api';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { ImageSchema } from './image';
import { CliSchema } from './cli';
import { PythonApiSchema } from './pythonApi';
import { AlgorithmSchema } from './algorithm';
import { LinguistOntologyIdSchema, SpdxOntologyIdSchema } from './ontologyId';
import { Algorithm } from './algorithm';
import { FundingSchema } from './funding';
import {
  IImage,
  ICli,
  IPythonApi,
  ILinguistOntologyId,
  ISpdxOntologyId,
  SoftwareInterfaceType,
  OperatingSystemType,
  Funding,
  ISimulator,
} from '@biosimulations/datamodel/common';
import { addValidationForNullableAttributes } from '@biosimulations/datamodel-database';
import { ExternalReferencesSchema, PersonSchema, UrlSchema } from './common';
import {
  BiosimulatorsMeta,
  BiosimulatorsMetaSchema,
} from './biosimulatorsMeta';

@Schema({
  collection: 'Simulators',
})
export class Simulator extends Document implements ISimulator {
  @Prop({ type: BiosimulatorsMetaSchema, required: true, default: undefined })
  biosimulators!: BiosimulatorsMeta;

  @Prop({
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    default: undefined,
  })
  id!: string;

  @Prop({ type: String, required: true, default: undefined })
  name!: string;

  @Prop({
    type: String,
    required: true,
    default: undefined,
  })
  version!: string;

  @Prop({ type: String, text: true, required: true, default: undefined })
  description!: string;

  @Prop({ type: [UrlSchema], required: true, default: undefined })
  urls!: Url[];

  @Prop({ type: ImageSchema, required: false, default: undefined })
  image!: IImage | null;

  @Prop({ type: CliSchema, required: false, default: undefined })
  cli!: ICli | null;

  @Prop({ type: PythonApiSchema, required: false, default: undefined })
  pythonApi!: IPythonApi | null;

  @Prop({ type: [PersonSchema], required: true, default: undefined })
  authors!: Person[];

  @Prop({ type: ExternalReferencesSchema, required: true, default: undefined })
  references!: ExternalReferences;

  @Prop({ type: SpdxOntologyIdSchema, required: false, default: undefined })
  license!: ISpdxOntologyId | null;

  @Prop({
    type: [AlgorithmSchema],
    _id: false,
    required: true,
    default: undefined,
  })
  algorithms!: Algorithm[];

  @Prop({
    type: [String],
    enum: Object.entries(SoftwareInterfaceType).map(
      (keyVal: [string, string]): string => {
        return keyVal[1];
      },
    ),
    required: true,
    default: undefined,
  })
  interfaceTypes!: SoftwareInterfaceType[];

  @Prop({
    type: [String],
    enum: Object.entries(OperatingSystemType).map(
      (keyVal: [string, string]): string => {
        return keyVal[1];
      },
    ),
    required: true,
    default: undefined,
  })
  supportedOperatingSystemTypes!: OperatingSystemType[];

  @Prop({
    type: [LinguistOntologyIdSchema],
    required: true,
    default: undefined,
  })
  supportedProgrammingLanguages!: ILinguistOntologyId[];

  @Prop({
    type: [FundingSchema],
    required: true,
    default: undefined,
  })
  funding!: Funding[];
}
export const SimulatorSchema = SchemaFactory.createForClass(Simulator);

// Can not be set in the decorator for compund schemas.
SimulatorSchema.index({ id: 1, version: 1 }, { unique: true });
SimulatorSchema.set('strict', 'throw');
//SimulatorSchema.set('id', false);

/* handle nullable attributes */
addValidationForNullableAttributes(SimulatorSchema);
