/**
 * BioSimulations COMBINE API
 * Endpoints for working with models (e.g., [CellML](https://cellml.org/), [SBML](http://sbml.org/)), simulation experiments (e.g., [Simulation Experiment Description Language (SED-ML)](https://sed-ml.org/)), metadata ([OMEX Metadata](https://sys-bio.github.io/libOmexMeta/)), and simulation projects ([COMBINE/OMEX archives](https://combinearchive.org/)).  Note, this API may change significantly in the future.
 *
 * The version of the OpenAPI document: 0.1
 * Contact: info@biosimulations.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { SedParameter } from './sedParameter';
import { SedVariable } from './sedVariable';

/**
 * Data generator for SED report or plot.
 */
export interface SedDataGenerator {
  /**
   * Unique identifier within its parent SED document.
   */
  id: string;
  /**
   * Brief description.
   */
  name?: string;
  /**
   * Parameters.
   */
  parameters: Array<SedParameter>;
  /**
   * Variables.
   */
  variables: Array<SedVariable>;
  /**
   * Mathematical expression for its value.
   */
  math: string;
  /**
   * Type.
   */
  _type: SedDataGeneratorTypeEnum;
}
export enum SedDataGeneratorTypeEnum {
  SedDataGenerator = 'SedDataGenerator',
}
