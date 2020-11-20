import { Ontologies, SboTerm, OntologyInfo } from '@biosimulations/datamodel/common';

import sboJson from './sbo.json';

let sboVersion: string = '';
function getSboTerms(input: any): { [id: string]: SboTerm } {
    const Terms: { [id: string]: SboTerm } = {};


    const jsonParse = input["@graph"]
    jsonParse.forEach(
        (jsonTerm: any) => {
            if (jsonTerm["@id"] === "http://biomodels.net/SBO/") {
                sboVersion = jsonTerm["owl:versionInfo"];
            } else if (jsonTerm["@id"].startsWith("http://biomodels.net/SBO/")) {


                const termIRI = jsonTerm["@id"];
                const termNameSpace = Ontologies.SBO
                const termId = jsonTerm["@id"].replace("http://biomodels.net/SBO/", "")
                const termDescription = jsonTerm["rdfs:comment"]
                const termName = jsonTerm["rdfs:label"]
                const termUrl = encodeURI("https://www.ebi.ac.uk/ols/ontologies/sbo/terms?iri=http%3A%2F%2Fbiomodels.net%2FSBO%2F" + termId)
                const term: SboTerm = {
                    id: termId,
                    name: termName,
                    description: termDescription,
                    namespace: termNameSpace,
                    iri: termIRI,
                    url: termUrl
                }


                Terms[termId] = term
            } else {
                return
            }
        })


    return Terms;

}

export const sboTerms = getSboTerms(sboJson);

export const sboInfo: OntologyInfo = {
  'bioportalId': 'SBO',
  'olsId': 'sbo',
  'version': sboVersion,
  'source': 'http://www.ebi.ac.uk/sbo/exports/Main/SBO_OWL.owl',
};