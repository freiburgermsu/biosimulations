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
import { SedAlgorithm } from './sedAlgorithm';

/**
 * A SED uniform time course simulation.
 */
export interface SedUniformTimeCourseSimulation {
  /**
   * Unique identifier within its parent SED document.
   */
  id: string;
  /**
   * Brief description.
   */
  name?: string;
  /**
   * Type of the simulation.
   */
  _type: SedUniformTimeCourseSimulationTypeEnum;
  /**
   * Initial time.
   */
  initialTime: number;
  /**
   * Output start time.
   */
  outputStartTime: number;
  /**
   * Output end time.
   */
  outputEndTime: number;
  /**
   * Number of steps.
   */
  numberOfSteps: number;
  algorithm: SedAlgorithm;
}
export enum SedUniformTimeCourseSimulationTypeEnum {
  SedUniformTimeCourseSimulation = 'SedUniformTimeCourseSimulation',
}
