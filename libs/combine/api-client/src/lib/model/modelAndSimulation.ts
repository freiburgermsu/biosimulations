/**
 * BioSimulations COMBINE service
 * Endpoints for working with COMBINE/OMEX archives and model (e.g., SBML) and simulation (e.g., SED-ML) files that they typically contain.  Note, this API may change significantly in the future.
 *
 * The version of the OpenAPI document: 0.1
 * Contact: info@biosimulations.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * A model file or URL and a type of simulation of that model.  Only one of \"modelFile\" or \"modelUrl\" should be used at a time. \"modelFile\" and  \"modelUrl\" cannot be used together.
 */
export interface ModelAndSimulation {
  /**
   * The two files uploaded in creating a combine archive
   */
  modelFile?: Blob;
  /**
   * A SED URN for a model language.  The full list of recognized values is available at http://sed-ml.org/urns.html.
   */
  modelLanguage: string;
  /**
   * Type of simulation.
   */
  simulationType: ModelAndSimulationSimulationType;
  /**
   * Identifier for an SBO term
   */
  modelingFramework: string;
  /**
   * KiSAO id
   */
  simulationAlgorithm: string;
  /**
   * URL
   */
  modelUrl?: string;
}
export enum ModelAndSimulationSimulationType {
  SedUniformTimeCourseSimulation = 'SedUniformTimeCourseSimulation',
  SedSteadyStateSimulation = 'SedSteadyStateSimulation',
  SedOneStepSimulation = 'SedOneStepSimulation',
}