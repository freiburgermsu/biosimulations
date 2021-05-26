/**
 * BioSimulations Data Service
 * RESTful application programming interface documentation for the Biosimulations Data Service, based on the HDF Scalable Data Service (HSDS) from the HDF Group.
 *
 * The version of the OpenAPI document: 1.0
 * Contact: info@biosimulations.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { InlineResponse2007TypeFields } from './inlineResponse2007TypeFields';

/**
 * TODO
 */
export interface InlineResponse2007Type {
  /**
   * TODO
   */
  _class?: InlineResponse2007Type.ClassEnum;
  /**
   * TODO Only present if class is not `H5T_COMPUND`.
   */
  base?: string;
  /**
   * List of fields in a compound dataset. Only present if `class` is `H5T_COMPOUND`.
   */
  fields?: Array<InlineResponse2007TypeFields>;
}
export namespace InlineResponse2007Type {
  export type ClassEnum = 'H5T_COMPOUND' | 'H5T_FLOAT' | 'H5T_INTEGER';
  export const ClassEnum = {
    Compound: 'H5T_COMPOUND' as ClassEnum,
    Float: 'H5T_FLOAT' as ClassEnum,
    Integer: 'H5T_INTEGER' as ClassEnum,
  };
}
