import { Injectable, NotFoundException } from '@nestjs/common';
import {
  edamInfo,
  funderRegistryInfo,
  linguistInfo,
  kisaoInfo,
  sboInfo,
  sioInfo,
  spdxInfo,
  sboTerms,
  edamTerms,
  funderRegistryTerms,
  linguistTerms,
  kisaoTerms,
  sioTerms,
  spdxTerms,
} from '@biosimulations/ontology/sources';
import {
  Ontologies,
  IOntologyTerm,
  IOntologyId,
  OntologyTermMap,
} from '@biosimulations/datamodel/common';
import { OntologyInfo } from '@biosimulations/datamodel/api';

@Injectable()
export class OntologyApiService {
  public getOntologyInfo(ontologyId: Ontologies): OntologyInfo | null {
    switch (ontologyId) {
      case Ontologies.EDAM:
        return edamInfo;
      case Ontologies.FunderRegistry:
        return funderRegistryInfo;
      case Ontologies.Linguist:
        return linguistInfo;
      case Ontologies.KISAO:
        return kisaoInfo;
      case Ontologies.SBO:
        return sboInfo;
      case Ontologies.SIO:
        return sioInfo;
      case Ontologies.SPDX:
        return spdxInfo;
    }
    return null;
  }

  private static _getOntologyTerms(
    ontologyId: Ontologies,
  ): OntologyTermMap<IOntologyTerm> | null {
    switch (ontologyId) {
      case Ontologies.EDAM:
        return edamTerms;
      case Ontologies.FunderRegistry:
        return funderRegistryTerms;
      case Ontologies.Linguist:
        return linguistTerms;
      case Ontologies.KISAO:
        return kisaoTerms;
      case Ontologies.SBO:
        return sboTerms;
      case Ontologies.SIO:
        return sioTerms;
      case Ontologies.SPDX:
        return spdxTerms;
    }
    return null;
  }

  public getOntologyTerms(ontologyId: Ontologies): IOntologyTerm[] | null {
    const termsObj = OntologyApiService._getOntologyTerms(ontologyId);
    if (termsObj == null) {
      return null;
    }

    const terms: IOntologyTerm[] = [];
    for (const term in termsObj) {
      terms.push(termsObj[term]);
    }
    return terms;
  }

  public getOntologyTerm(
    ontologyId: Ontologies,
    termId: string,
  ): IOntologyTerm | null {
    const termsObj = OntologyApiService._getOntologyTerms(ontologyId);
    if (termsObj == null) {
      return null;
    }

    return termsObj[termId] || null;
  }

  public static isOntologyTermId(
    ontologyId: Ontologies,
    termId: string,
    parentTermId?: string,
  ): boolean {
    const termsObj = OntologyApiService._getOntologyTerms(ontologyId);
    if (termsObj == null) {
      return false;
    }

    const term = termsObj[termId];
    if (!term) {
      return false;
    }

    if (!parentTermId) {
      return true;
    }

    if (term.parents.includes(parentTermId)) {
      return true;
    }

    let parentIdsToCheck: string[] = [...term.parents];
    while (parentIdsToCheck.length > 0) {
      const parentId = parentIdsToCheck.pop();
      if (!parentId) {
        continue;
      }

      const parent: IOntologyTerm | null = termsObj?.[parentId];
      if (!parent) {
        continue;
      }
      if (parent.parents.includes(parentTermId)) {
        return true;
      }
      parentIdsToCheck = parentIdsToCheck.concat(parent.parents);
    }

    return false;
  }

  public getTerms(
    ids: IOntologyId[],
    fields?: string[],
  ): Partial<IOntologyTerm[]> {
    const terms: Partial<IOntologyTerm[]> = [];
    const invalidIds: string[] = [];

    ids.forEach((id: IOntologyId): void => {
      const term = this.getOntologyTerm(id.namespace, id.id);
      if (term) {
        if (fields === undefined) {
          terms.push(term);
        } else {
          const leanTerm: any = {};
          fields.forEach((field: string): void => {
            leanTerm[field] = (term as any)?.[field];
          });
          terms.push(leanTerm);
        }
      } else {
        invalidIds.push(`\n  - ${id.namespace}: ${id.id}`);
      }
    });

    if (invalidIds.length) {
      throw new NotFoundException(
        `${invalidIds.length} ${
          invalidIds.length === 1 ? 'id is' : 'ids are'
        } not valid:${invalidIds.join('')}`,
      );
    }

    return terms;
  }
}
