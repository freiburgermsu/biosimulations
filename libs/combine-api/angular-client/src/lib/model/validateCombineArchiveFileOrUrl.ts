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

/**
 * File or a URL for getting the metadata in a COMBINE/OMEX archive.
 */
export interface ValidateCombineArchiveFileOrUrl {
  /**
   * The two files uploaded in creating a combine archive
   */
  file?: Blob;
  /**
   * URL
   */
  url?: string;
  /**
   * OMEX Metadata format
   */
  omexMetadataFormat: ValidateCombineArchiveFileOrUrlOmexMetadataFormatEnum;
  /**
   * Whether to validate the manifest of the archive.  Default: `true`.
   */
  validateOmexManifest?: boolean;
  /**
   * OMEX Metadata schema
   */
  omexMetadataSchema: ValidateCombineArchiveFileOrUrlOmexMetadataSchemaEnum;
  /**
   * Whether to validate the SED-ML files in the archive.  Default: `true`.
   */
  validateSedml?: boolean;
  /**
   * Whether to validate the source (e.g., CellML, SBML file) of each model of each SED-ML file in the archive.  Default: `true`.
   */
  validateSedmlModels?: boolean;
  /**
   * Whether to validate the OMEX Metadata files in the archive according to [BioSimulators\' conventions](https://docs.biosimulations.org/concepts/conventions/simulation-project-metadata/).  Default: `true`.
   */
  validateOmexMetadata?: boolean;
  /**
   * Whether to validate the image (BMP, GIF, PNG, JPEG, TIFF, WEBP) files in the archive.  Default: `true`.
   */
  validateImages?: boolean;
}
export enum ValidateCombineArchiveFileOrUrlOmexMetadataFormatEnum {
  Ntriples = 'ntriples',
  Nquads = 'nquads',
  Rdfa = 'rdfa',
  Rdfxml = 'rdfxml',
  Turtle = 'turtle',
}
export enum ValidateCombineArchiveFileOrUrlOmexMetadataSchemaEnum {
  BioSimulations = 'BioSimulations',
  RdfTriples = 'rdf_triples',
}
