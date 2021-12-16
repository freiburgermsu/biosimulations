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
/* tslint:disable:no-unused-variable member-ordering */
import FormData from 'form-data';

import { HttpService, Inject, Injectable, Optional } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { KisaoAlgorithmSubstitution } from '../model/kisaoAlgorithmSubstitution';
import { Configuration } from '../configuration';

@Injectable()
export class SimulationAlgorithmsService {
  protected basePath = 'https://combine.api.biosimulations.dev';
  public defaultHeaders = new Map();
  public configuration = new Configuration();

  constructor(
    protected httpClient: HttpService,
    @Optional() configuration: Configuration,
  ) {
    this.configuration = configuration || this.configuration;
    this.basePath = configuration?.basePath || this.basePath;
  }

  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  private canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    return consumes.includes(form);
  }

  /**
   * Get a list of algorithms similar to an algorithm
   *
   * @param algorithms KiSOA id of the algorithm to find similar algorithms for.
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public srcHandlersKisaoGetSimilarAlgorithmsHandler(
    algorithms: Array<string>,
  ): Observable<AxiosResponse<Array<KisaoAlgorithmSubstitution>>>;
  public srcHandlersKisaoGetSimilarAlgorithmsHandler(
    algorithms: Array<string>,
  ): Observable<any> {
    if (algorithms === null || algorithms === undefined) {
      throw new Error(
        'Required parameter algorithms was null or undefined when calling srcHandlersKisaoGetSimilarAlgorithmsHandler.',
      );
    }

    let queryParameters: any = {};
    if (algorithms !== undefined && algorithms !== null) {
      queryParameters['algorithms'] = <any>algorithms;
    }

    let headers: any = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers['Accept'] = httpHeaderAcceptSelected;
    }

    // to determine the Content-Type header
    const consumes: string[] = [];
    return this.httpClient.get<Array<KisaoAlgorithmSubstitution>>(
      `${this.basePath}/kisao/get-similar-algorithms`,
      {
        params: queryParameters,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
      },
    );
  }
}