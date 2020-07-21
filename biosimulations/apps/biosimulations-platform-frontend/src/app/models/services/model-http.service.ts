import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ModelsDocument,
  ModelDocument,
  ModelResource,
} from '@biosimulations/datamodel/api';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';
import { Model } from '../model';

@Injectable({
  providedIn: 'root',
})
export class ModelHttpService {
  name = 'model';
  url = 'https://api.biosimulations.dev/models';
  // url = 'http://localhost:3333/models';

  constructor(private http: HttpClient) {}

  // A map of id to http response for each model
  private models: Map<string, ModelResource> = new Map();

  // Behavior subject from the initial loading of the models. Blank at creation
  private models$ = new BehaviorSubject(this.models);

  // has the data been loaded at least once?
  private firstLoad = false;

  // Loading timings, probably not needed
  private initialLoadStarted$ = new BehaviorSubject(false);
  private initialLoadFinished$ = new BehaviorSubject(false);

  // Is there an active http request?
  private loading$ = new BehaviorSubject(false);

  // Refresh the mapping. Maybe call this at app init?
  public refresh(id?: string) {
    if (id) {
      this.load(id).subscribe();
    } else {
      this.loadAll().subscribe();
    }
  }

  // Load all the models from api, save to map
  private loadAll() {
    this.firstLoad = true;
    this.loading$.next(true);

    const response = {
      "data": [{
        "type": "model",
        "id": "biomd0000000001",
        "attributes": {
          "parameters": [{
            "recommendedRange": [300, 30000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_0']/@value",
            "group": "Other global parameters",
            "id": "kf_0",
            "name": "kf_0",
            "description": "",
            "type": "float",
            "value": 3000,
            "units": null
          }, {
            "recommendedRange": [800, 80000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_0']/@value",
            "group": "Other global parameters",
            "id": "kr_0",
            "name": "kr_0",
            "description": "",
            "type": "float",
            "value": 8000,
            "units": null
          }, {
            "recommendedRange": [150, 15000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_1']/@value",
            "group": "Other global parameters",
            "id": "kf_1",
            "name": "kf_1",
            "description": "",
            "type": "float",
            "value": 1500,
            "units": null
          }, {
            "recommendedRange": [1600, 160000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_1']/@value",
            "group": "Other global parameters",
            "id": "kr_1",
            "name": "kr_1",
            "description": "",
            "type": "float",
            "value": 16000,
            "units": null
          }, {
            "recommendedRange": [3000, 300000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_2']/@value",
            "group": "Other global parameters",
            "id": "kf_2",
            "name": "kf_2",
            "description": "",
            "type": "float",
            "value": 30000,
            "units": null
          }, {
            "recommendedRange": [70, 7000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_2']/@value",
            "group": "Other global parameters",
            "id": "kr_2",
            "name": "kr_2",
            "description": "",
            "type": "float",
            "value": 700,
            "units": null
          }, {
            "recommendedRange": [300, 30000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_3']/@value",
            "group": "Other global parameters",
            "id": "kf_3",
            "name": "kf_3",
            "description": "",
            "type": "float",
            "value": 3000,
            "units": null
          }, {
            "recommendedRange": [0.8640000000000001, 86.4],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_3']/@value",
            "group": "Other global parameters",
            "id": "kr_3",
            "name": "kr_3",
            "description": "",
            "type": "float",
            "value": 8.64,
            "units": null
          }, {
            "recommendedRange": [150, 15000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_4']/@value",
            "group": "Other global parameters",
            "id": "kf_4",
            "name": "kf_4",
            "description": "",
            "type": "float",
            "value": 1500,
            "units": null
          }, {
            "recommendedRange": [1.7280000000000002, 172.8],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_4']/@value",
            "group": "Other global parameters",
            "id": "kr_4",
            "name": "kr_4",
            "description": "",
            "type": "float",
            "value": 17.28,
            "units": null
          }, {
            "recommendedRange": [0.054000000000000006, 5.4],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_5']/@value",
            "group": "Other global parameters",
            "id": "kf_5",
            "name": "kf_5",
            "description": "",
            "type": "float",
            "value": 0.54,
            "units": null
          }, {
            "recommendedRange": [1080, 108000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_5']/@value",
            "group": "Other global parameters",
            "id": "kr_5",
            "name": "kr_5",
            "description": "",
            "type": "float",
            "value": 10800,
            "units": null
          }, {
            "recommendedRange": [13, 1300],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_6']/@value",
            "group": "Other global parameters",
            "id": "kf_6",
            "name": "kf_6",
            "description": "",
            "type": "float",
            "value": 130,
            "units": null
          }, {
            "recommendedRange": [274, 27400],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_6']/@value",
            "group": "Other global parameters",
            "id": "kr_6",
            "name": "kr_6",
            "description": "",
            "type": "float",
            "value": 2740,
            "units": null
          }, {
            "recommendedRange": [300, 30000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_7']/@value",
            "group": "Other global parameters",
            "id": "kf_7",
            "name": "kf_7",
            "description": "",
            "type": "float",
            "value": 3000,
            "units": null
          }, {
            "recommendedRange": [0.4, 40],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_7']/@value",
            "group": "Other global parameters",
            "id": "kr_7",
            "name": "kr_7",
            "description": "",
            "type": "float",
            "value": 4,
            "units": null
          }, {
            "recommendedRange": [150, 15000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_8']/@value",
            "group": "Other global parameters",
            "id": "kf_8",
            "name": "kf_8",
            "description": "",
            "type": "float",
            "value": 1500,
            "units": null
          }, {
            "recommendedRange": [0.8, 80],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_8']/@value",
            "group": "Other global parameters",
            "id": "kr_8",
            "name": "kr_8",
            "description": "",
            "type": "float",
            "value": 8,
            "units": null
          }, {
            "recommendedRange": [1.97, 197],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_9']/@value",
            "group": "Other global parameters",
            "id": "kf_9",
            "name": "kf_9",
            "description": "",
            "type": "float",
            "value": 19.7,
            "units": null
          }, {
            "recommendedRange": [0.37400000000000005, 37.400000000000006],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_9']/@value",
            "group": "Other global parameters",
            "id": "kr_9",
            "name": "kr_9",
            "description": "",
            "type": "float",
            "value": 3.74,
            "units": null
          }, {
            "recommendedRange": [1.9850000000000003, 198.5],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_10']/@value",
            "group": "Other global parameters",
            "id": "kf_10",
            "name": "kf_10",
            "description": "",
            "type": "float",
            "value": 19.85,
            "units": null
          }, {
            "recommendedRange": [0.17400000000000002, 17.4],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_10']/@value",
            "group": "Other global parameters",
            "id": "kr_10",
            "name": "kr_10",
            "description": "",
            "type": "float",
            "value": 1.74,
            "units": null
          }, {
            "recommendedRange": [2, 200],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_11']/@value",
            "group": "Other global parameters",
            "id": "kf_11",
            "name": "kf_11",
            "description": "",
            "type": "float",
            "value": 20,
            "units": null
          }, {
            "recommendedRange": [0.08100000000000002, 8.100000000000001],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_11']/@value",
            "group": "Other global parameters",
            "id": "kr_11",
            "name": "kr_11",
            "description": "",
            "type": "float",
            "value": 0.81,
            "units": null
          }, {
            "recommendedRange": [300, 30000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_12']/@value",
            "group": "Other global parameters",
            "id": "kf_12",
            "name": "kf_12",
            "description": "",
            "type": "float",
            "value": 3000,
            "units": null
          }, {
            "recommendedRange": [0.4, 40],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_12']/@value",
            "group": "Other global parameters",
            "id": "kr_12",
            "name": "kr_12",
            "description": "",
            "type": "float",
            "value": 4,
            "units": null
          }, {
            "recommendedRange": [150, 15000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_13']/@value",
            "group": "Other global parameters",
            "id": "kf_13",
            "name": "kf_13",
            "description": "",
            "type": "float",
            "value": 1500,
            "units": null
          }, {
            "recommendedRange": [0.8, 80],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_13']/@value",
            "group": "Other global parameters",
            "id": "kr_13",
            "name": "kr_13",
            "description": "",
            "type": "float",
            "value": 8,
            "units": null
          }, {
            "recommendedRange": [0.005000000000000001, 0.5],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_14']/@value",
            "group": "Other global parameters",
            "id": "kf_14",
            "name": "kf_14",
            "description": "",
            "type": "float",
            "value": 0.05,
            "units": null
          }, {
            "recommendedRange": [0.00011999999999999999, 0.011999999999999999],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_14']/@value",
            "group": "Other global parameters",
            "id": "kr_14",
            "name": "kr_14",
            "description": "",
            "type": "float",
            "value": 0.0012,
            "units": null
          }, {
            "recommendedRange": [0.005000000000000001, 0.5],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_15']/@value",
            "group": "Other global parameters",
            "id": "kf_15",
            "name": "kf_15",
            "description": "",
            "type": "float",
            "value": 0.05,
            "units": null
          }, {
            "recommendedRange": [0.00011999999999999999, 0.011999999999999999],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_15']/@value",
            "group": "Other global parameters",
            "id": "kr_15",
            "name": "kr_15",
            "description": "",
            "type": "float",
            "value": 0.0012,
            "units": null
          }, {
            "recommendedRange": [0.005000000000000001, 0.5],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_16']/@value",
            "group": "Other global parameters",
            "id": "kf_16",
            "name": "kf_16",
            "description": "",
            "type": "float",
            "value": 0.05,
            "units": null
          }, {
            "recommendedRange": [0.00011999999999999999, 0.011999999999999999],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_16']/@value",
            "group": "Other global parameters",
            "id": "kr_16",
            "name": "kr_16",
            "description": "",
            "type": "float",
            "value": 0.0012,
            "units": null
          }, {
            "recommendedRange": [2, 200],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='t2']/@value",
            "group": "Other global parameters",
            "id": "t2",
            "name": "t2",
            "description": "",
            "type": "float",
            "value": 20,
            "units": null
          }, {
            "recommendedRange": [1e-17, 1e-15],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfCompartments/sbml:compartment[@id='comp1']/@size",
            "group": "Initial compartment sizes",
            "id": "init_size_comp1",
            "name": "Initial size of compartment1",
            "description": "",
            "type": "float",
            "value": 1e-16,
            "units": "liter"
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='BLL']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_BLL",
            "name": "Initial amount of BasalACh2",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='IL']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_IL",
            "name": "Initial amount of IntermediateACh",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='AL']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_AL",
            "name": "Initial amount of ActiveACh",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='A']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_A",
            "name": "Initial amount of Active",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='BL']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_BL",
            "name": "Initial amount of BasalACh",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [1.6605778811026202e-22, 1.66057788110262e-20],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='B']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_B",
            "name": "Initial amount of Basal",
            "description": "",
            "type": "float",
            "value": 1.66057788110262e-21,
            "units": ""
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='DLL']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_DLL",
            "name": "Initial amount of DesensitisedACh2",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='D']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_D",
            "name": "Initial amount of Desensitised",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='ILL']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_ILL",
            "name": "Initial amount of IntermediateACh2",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='DL']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_DL",
            "name": "Initial amount of DesensitisedACh",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='I']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_I",
            "name": "Initial amount of Intermediate",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='ALL']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_ALL",
            "name": "Initial amount of ActiveACh2",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }],
          "variables": [{
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='BLL']",
            "group": "Species amounts/concentrations",
            "id": "BLL",
            "name": "BasalACh2",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='IL']",
            "group": "Species amounts/concentrations",
            "id": "IL",
            "name": "IntermediateACh",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='AL']",
            "group": "Species amounts/concentrations",
            "id": "AL",
            "name": "ActiveACh",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='A']",
            "group": "Species amounts/concentrations",
            "id": "A",
            "name": "Active",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='BL']",
            "group": "Species amounts/concentrations",
            "id": "BL",
            "name": "BasalACh",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='B']",
            "group": "Species amounts/concentrations",
            "id": "B",
            "name": "Basal",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='DLL']",
            "group": "Species amounts/concentrations",
            "id": "DLL",
            "name": "DesensitisedACh2",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='D']",
            "group": "Species amounts/concentrations",
            "id": "D",
            "name": "Desensitised",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='ILL']",
            "group": "Species amounts/concentrations",
            "id": "ILL",
            "name": "IntermediateACh2",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='DL']",
            "group": "Species amounts/concentrations",
            "id": "DL",
            "name": "DesensitisedACh",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='I']",
            "group": "Species amounts/concentrations",
            "id": "I",
            "name": "Intermediate",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='ALL']",
            "group": "Species amounts/concentrations",
            "id": "ALL",
            "name": "ActiveACh2",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }],
          "taxon": {
            "id": 7787,
            "name": "Tetronarce californica"
          },
          "framework": {
            "ontology": "SBO",
            "id": "0000293",
            "name": "non-spatial continuous framework",
            "description": "Modelling approach where the quantities of participants are considered continuous, and represented by real values. The associated simulation methods make use of differential equations. The models do not take into account the distribution of the entities and describe only the temporal fluxes.",
            "iri": "http://biomodels.net/SBO/SBO_0000293"
          },
          "format": {
            "id": "SBML",
            "name": "Systems Biology Markup Language",
            "version": "L2V4",
            "edamId": "format_2585",
            "url": "http://sbml.org/",
            "specUrl": "http://identifiers.org/combine.specifications/sbml",
            "mimetype": "application/sbml+xml",
            "extension": "xml",
            "sedUrn": "urn:sedml:language:sbml"
          },
          "metadata": {
            "license": "CC0",
            "authors": [{
              "firstName": "S",
              "middleName": "J",
              "lastName": "Edelstein"
            }, {
              "firstName": "O",
              "middleName": null,
              "lastName": "Schaad"
            }, {
              "firstName": "E",
              "middleName": null,
              "lastName": "Henry"
            }, {
              "firstName": "D",
              "middleName": null,
              "lastName": "Bertrand"
            }, {
              "firstName": "J",
              "middleName": "P",
              "lastName": "Changeux"
            }],
            "references": {
              "identifiers": [{
                "namespace": "biomodels.db",
                "id": "BIOMD0000000001",
                "url": "http://www.ebi.ac.uk/biomodels/BIOMD0000000001"
              }],
              "citations": [{
                "authors": "S J Edelstein, O Schaad, E Henry, D Bertrand & J P Changeux",
                "title": "A kinetic mechanism for nicotinic acetylcholine receptors based on multiple allosteric transitions.",
                "journal": "Biological cybernetics",
                "volume": "75",
                "issue": null,
                "pages": "361-379",
                "year": 1996,
                "doi": "10.1007/s004220050302"
              }],
              "doi": null
            },
            "tags": [],
            "summary": "Model of a nicotinic Excitatory Post-Synaptic Potential in a  Torpedo electric organ",
            "description": "<div>\n  <p>Model of a nicotinic Excitatory Post-Synaptic Potential in a\n  Torpedo electric organ. Acetylcholine is not represented\n  explicitely, but by an event that changes the constants of\n  transition from unliganded to liganded. \n  <br/></p>\n</div>",
            "name": "Edelstein1996 - EPSP ACh event",
            "accessLevel": "public"
          }
        },
        "relationships": {
          "owner": {
            "data": {
              "type": "user",
              "id": "jonrkarr"
            }
          },
          "file": {
            "data": {
              "type": "file",
              "id": "biomd0000000001-file"
            }
          },
          "image": {
            "data": {
              "type": "file",
              "id": "biomd0000000001-thumbnail"
            }
          },
          "parent": {
            "data": null
          }
        },
        "meta": {
          "created": 1593547540943,
          "updated": 1593547540943,
          "version": 1
        }
      }, {
        "type": "model",
        "id": "biomd0000000002",
        "attributes": {
          "parameters": [{
            "recommendedRange": [30000000, 3000000000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_0']/@value",
            "group": "Other global parameters",
            "id": "kf_0",
            "name": "kf_0",
            "description": "",
            "type": "float",
            "value": 300000000,
            "units": null
          }, {
            "recommendedRange": [800, 80000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_0']/@value",
            "group": "Other global parameters",
            "id": "kr_0",
            "name": "kr_0",
            "description": "",
            "type": "float",
            "value": 8000,
            "units": null
          }, {
            "recommendedRange": [15000000, 1500000000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_1']/@value",
            "group": "Other global parameters",
            "id": "kf_1",
            "name": "kf_1",
            "description": "",
            "type": "float",
            "value": 150000000,
            "units": null
          }, {
            "recommendedRange": [1600, 160000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_1']/@value",
            "group": "Other global parameters",
            "id": "kr_1",
            "name": "kr_1",
            "description": "",
            "type": "float",
            "value": 16000,
            "units": null
          }, {
            "recommendedRange": [3000, 300000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_2']/@value",
            "group": "Other global parameters",
            "id": "kf_2",
            "name": "kf_2",
            "description": "",
            "type": "float",
            "value": 30000,
            "units": null
          }, {
            "recommendedRange": [70, 7000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_2']/@value",
            "group": "Other global parameters",
            "id": "kr_2",
            "name": "kr_2",
            "description": "",
            "type": "float",
            "value": 700,
            "units": null
          }, {
            "recommendedRange": [30000000, 3000000000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_3']/@value",
            "group": "Other global parameters",
            "id": "kf_3",
            "name": "kf_3",
            "description": "",
            "type": "float",
            "value": 300000000,
            "units": null
          }, {
            "recommendedRange": [0.8640000000000001, 86.4],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_3']/@value",
            "group": "Other global parameters",
            "id": "kr_3",
            "name": "kr_3",
            "description": "",
            "type": "float",
            "value": 8.64,
            "units": null
          }, {
            "recommendedRange": [15000000, 1500000000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_4']/@value",
            "group": "Other global parameters",
            "id": "kf_4",
            "name": "kf_4",
            "description": "",
            "type": "float",
            "value": 150000000,
            "units": null
          }, {
            "recommendedRange": [1.7280000000000002, 172.8],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_4']/@value",
            "group": "Other global parameters",
            "id": "kr_4",
            "name": "kr_4",
            "description": "",
            "type": "float",
            "value": 17.28,
            "units": null
          }, {
            "recommendedRange": [0.054000000000000006, 5.4],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_5']/@value",
            "group": "Other global parameters",
            "id": "kf_5",
            "name": "kf_5",
            "description": "",
            "type": "float",
            "value": 0.54,
            "units": null
          }, {
            "recommendedRange": [1080, 108000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_5']/@value",
            "group": "Other global parameters",
            "id": "kr_5",
            "name": "kr_5",
            "description": "",
            "type": "float",
            "value": 10800,
            "units": null
          }, {
            "recommendedRange": [13, 1300],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_6']/@value",
            "group": "Other global parameters",
            "id": "kf_6",
            "name": "kf_6",
            "description": "",
            "type": "float",
            "value": 130,
            "units": null
          }, {
            "recommendedRange": [274, 27400],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_6']/@value",
            "group": "Other global parameters",
            "id": "kr_6",
            "name": "kr_6",
            "description": "",
            "type": "float",
            "value": 2740,
            "units": null
          }, {
            "recommendedRange": [30000000, 3000000000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_7']/@value",
            "group": "Other global parameters",
            "id": "kf_7",
            "name": "kf_7",
            "description": "",
            "type": "float",
            "value": 300000000,
            "units": null
          }, {
            "recommendedRange": [0.4, 40],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_7']/@value",
            "group": "Other global parameters",
            "id": "kr_7",
            "name": "kr_7",
            "description": "",
            "type": "float",
            "value": 4,
            "units": null
          }, {
            "recommendedRange": [15000000, 1500000000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_8']/@value",
            "group": "Other global parameters",
            "id": "kf_8",
            "name": "kf_8",
            "description": "",
            "type": "float",
            "value": 150000000,
            "units": null
          }, {
            "recommendedRange": [0.8, 80],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_8']/@value",
            "group": "Other global parameters",
            "id": "kr_8",
            "name": "kr_8",
            "description": "",
            "type": "float",
            "value": 8,
            "units": null
          }, {
            "recommendedRange": [1.97, 197],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_9']/@value",
            "group": "Other global parameters",
            "id": "kf_9",
            "name": "kf_9",
            "description": "",
            "type": "float",
            "value": 19.7,
            "units": null
          }, {
            "recommendedRange": [0.37400000000000005, 37.400000000000006],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_9']/@value",
            "group": "Other global parameters",
            "id": "kr_9",
            "name": "kr_9",
            "description": "",
            "type": "float",
            "value": 3.74,
            "units": null
          }, {
            "recommendedRange": [1.9850000000000003, 198.5],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_10']/@value",
            "group": "Other global parameters",
            "id": "kf_10",
            "name": "kf_10",
            "description": "",
            "type": "float",
            "value": 19.85,
            "units": null
          }, {
            "recommendedRange": [0.17400000000000002, 17.4],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_10']/@value",
            "group": "Other global parameters",
            "id": "kr_10",
            "name": "kr_10",
            "description": "",
            "type": "float",
            "value": 1.74,
            "units": null
          }, {
            "recommendedRange": [2, 200],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_11']/@value",
            "group": "Other global parameters",
            "id": "kf_11",
            "name": "kf_11",
            "description": "",
            "type": "float",
            "value": 20,
            "units": null
          }, {
            "recommendedRange": [0.08100000000000002, 8.100000000000001],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_11']/@value",
            "group": "Other global parameters",
            "id": "kr_11",
            "name": "kr_11",
            "description": "",
            "type": "float",
            "value": 0.81,
            "units": null
          }, {
            "recommendedRange": [30000000, 3000000000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_12']/@value",
            "group": "Other global parameters",
            "id": "kf_12",
            "name": "kf_12",
            "description": "",
            "type": "float",
            "value": 300000000,
            "units": null
          }, {
            "recommendedRange": [0.4, 40],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_12']/@value",
            "group": "Other global parameters",
            "id": "kr_12",
            "name": "kr_12",
            "description": "",
            "type": "float",
            "value": 4,
            "units": null
          }, {
            "recommendedRange": [15000000, 1500000000],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_13']/@value",
            "group": "Other global parameters",
            "id": "kf_13",
            "name": "kf_13",
            "description": "",
            "type": "float",
            "value": 150000000,
            "units": null
          }, {
            "recommendedRange": [0.8, 80],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_13']/@value",
            "group": "Other global parameters",
            "id": "kr_13",
            "name": "kr_13",
            "description": "",
            "type": "float",
            "value": 8,
            "units": null
          }, {
            "recommendedRange": [0.005000000000000001, 0.5],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_14']/@value",
            "group": "Other global parameters",
            "id": "kf_14",
            "name": "kf_14",
            "description": "",
            "type": "float",
            "value": 0.05,
            "units": null
          }, {
            "recommendedRange": [0.00011999999999999999, 0.011999999999999999],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_14']/@value",
            "group": "Other global parameters",
            "id": "kr_14",
            "name": "kr_14",
            "description": "",
            "type": "float",
            "value": 0.0012,
            "units": null
          }, {
            "recommendedRange": [0.005000000000000001, 0.5],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_15']/@value",
            "group": "Other global parameters",
            "id": "kf_15",
            "name": "kf_15",
            "description": "",
            "type": "float",
            "value": 0.05,
            "units": null
          }, {
            "recommendedRange": [0.00011999999999999999, 0.011999999999999999],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_15']/@value",
            "group": "Other global parameters",
            "id": "kr_15",
            "name": "kr_15",
            "description": "",
            "type": "float",
            "value": 0.0012,
            "units": null
          }, {
            "recommendedRange": [0.005000000000000001, 0.5],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kf_16']/@value",
            "group": "Other global parameters",
            "id": "kf_16",
            "name": "kf_16",
            "description": "",
            "type": "float",
            "value": 0.05,
            "units": null
          }, {
            "recommendedRange": [0.00011999999999999999, 0.011999999999999999],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='kr_16']/@value",
            "group": "Other global parameters",
            "id": "kr_16",
            "name": "kr_16",
            "description": "",
            "type": "float",
            "value": 0.0012,
            "units": null
          }, {
            "recommendedRange": [1e-17, 1e-15],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfCompartments/sbml:compartment[@id='comp1']/@size",
            "group": "Initial compartment sizes",
            "id": "init_size_comp1",
            "name": "Initial size of compartment1",
            "description": "",
            "type": "float",
            "value": 1e-16,
            "units": "liter"
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='BLL']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_BLL",
            "name": "Initial amount of BasalACh2",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='IL']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_IL",
            "name": "Initial amount of IntermediateACh",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='AL']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_AL",
            "name": "Initial amount of ActiveACh",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='A']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_A",
            "name": "Initial amount of Active",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='BL']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_BL",
            "name": "Initial amount of BasalACh",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [1.0000000000000001e-23, 1.0000000000000001e-21],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='B']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_B",
            "name": "Initial amount of Basal",
            "description": "",
            "type": "float",
            "value": 1e-22,
            "units": ""
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='DLL']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_DLL",
            "name": "Initial amount of DesensitisedACh2",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='D']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_D",
            "name": "Initial amount of Desensitised",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='ILL']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_ILL",
            "name": "Initial amount of IntermediateACh2",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='DL']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_DL",
            "name": "Initial amount of DesensitisedACh",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='I']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_I",
            "name": "Initial amount of Intermediate",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [0, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='ALL']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_ALL",
            "name": "Initial amount of ActiveACh2",
            "description": "",
            "type": "float",
            "value": 0,
            "units": ""
          }, {
            "recommendedRange": [9.999999999999999e-23, 1e-20],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='L']/@initialAmount",
            "group": "Initial species amounts/concentrations",
            "id": "init_amount_L",
            "name": "Initial amount of ACh",
            "description": "",
            "type": "float",
            "value": 1e-21,
            "units": ""
          }],
          "variables": [{
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='BLL']",
            "group": "Species amounts/concentrations",
            "id": "BLL",
            "name": "BasalACh2",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='IL']",
            "group": "Species amounts/concentrations",
            "id": "IL",
            "name": "IntermediateACh",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='AL']",
            "group": "Species amounts/concentrations",
            "id": "AL",
            "name": "ActiveACh",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='A']",
            "group": "Species amounts/concentrations",
            "id": "A",
            "name": "Active",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='BL']",
            "group": "Species amounts/concentrations",
            "id": "BL",
            "name": "BasalACh",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='B']",
            "group": "Species amounts/concentrations",
            "id": "B",
            "name": "Basal",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='DLL']",
            "group": "Species amounts/concentrations",
            "id": "DLL",
            "name": "DesensitisedACh2",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='D']",
            "group": "Species amounts/concentrations",
            "id": "D",
            "name": "Desensitised",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='ILL']",
            "group": "Species amounts/concentrations",
            "id": "ILL",
            "name": "IntermediateACh2",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='DL']",
            "group": "Species amounts/concentrations",
            "id": "DL",
            "name": "DesensitisedACh",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='I']",
            "group": "Species amounts/concentrations",
            "id": "I",
            "name": "Intermediate",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='ALL']",
            "group": "Species amounts/concentrations",
            "id": "ALL",
            "name": "ActiveACh2",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='L']",
            "group": "Species amounts/concentrations",
            "id": "L",
            "name": "ACh",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }],
          "taxon": {
            "id": 7787,
            "name": "Tetronarce californica"
          },
          "framework": {
            "ontology": "SBO",
            "id": "0000293",
            "name": "non-spatial continuous framework",
            "description": "Modelling approach where the quantities of participants are considered continuous, and represented by real values. The associated simulation methods make use of differential equations. The models do not take into account the distribution of the entities and describe only the temporal fluxes.",
            "iri": "http://biomodels.net/SBO/SBO_0000293"
          },
          "format": {
            "id": "SBML",
            "name": "Systems Biology Markup Language",
            "version": "L2V4",
            "edamId": "format_2585",
            "url": "http://sbml.org/",
            "specUrl": "http://identifiers.org/combine.specifications/sbml",
            "mimetype": "application/sbml+xml",
            "extension": "xml",
            "sedUrn": "urn:sedml:language:sbml"
          },
          "metadata": {
            "license": "CC0",
            "authors": [{
              "firstName": "S",
              "middleName": "J",
              "lastName": "Edelstein"
            }, {
              "firstName": "O",
              "middleName": null,
              "lastName": "Schaad"
            }, {
              "firstName": "E",
              "middleName": null,
              "lastName": "Henry"
            }, {
              "firstName": "D",
              "middleName": null,
              "lastName": "Bertrand"
            }, {
              "firstName": "J",
              "middleName": "P",
              "lastName": "Changeux"
            }],
            "references": {
              "identifiers": [{
                "namespace": "biomodels.db",
                "id": "BIOMD0000000002",
                "url": "http://www.ebi.ac.uk/biomodels/BIOMD0000000002"
              }],
              "citations": [{
                "authors": "S J Edelstein, O Schaad, E Henry, D Bertrand & J P Changeux",
                "title": "A kinetic mechanism for nicotinic acetylcholine receptors based on multiple allosteric transitions.",
                "journal": "Biological cybernetics",
                "volume": "75",
                "issue": null,
                "pages": "361-379",
                "year": 1996,
                "doi": "10.1007/s004220050302"
              }],
              "doi": null
            },
            "tags": [],
            "summary": null,
            "description": "<div>      <p>Model of a nicotinic Excitatory Post-Synaptic Potential in a Torpedo electric organ. Acetylcholine is represented explicitely as a molecular species.</p>\n                </div>",
            "name": "Edelstein1996 - EPSP ACh species",
            "accessLevel": "public"
          }
        },
        "relationships": {
          "owner": {
            "data": {
              "type": "user",
              "id": "jonrkarr"
            }
          },
          "file": {
            "data": {
              "type": "file",
              "id": "biomd0000000002-file"
            }
          },
          "image": {
            "data": {
              "type": "file",
              "id": "biomd0000000002-thumbnail"
            }
          },
          "parent": {
            "data": null
          }
        },
        "meta": {
          "created": 1593547570081,
          "updated": 1593547570081,
          "version": 1
        }
      }, {
        "type": "model",
        "id": "biomd0000000003",
        "attributes": {
          "parameters": [{
            "recommendedRange": [0.30000000000000004, 30],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='VM1']/@value",
            "group": "Other global parameters",
            "id": "VM1",
            "name": "VM1",
            "description": "",
            "type": "float",
            "value": 3,
            "units": null
          }, {
            "recommendedRange": [0.1, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='VM3']/@value",
            "group": "Other global parameters",
            "id": "VM3",
            "name": "VM3",
            "description": "",
            "type": "float",
            "value": 1,
            "units": null
          }, {
            "recommendedRange": [0.05, 5],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='Kc']/@value",
            "group": "Other global parameters",
            "id": "Kc",
            "name": "Kc",
            "description": "",
            "type": "float",
            "value": 0.5,
            "units": null
          }, {
            "recommendedRange": [0.0025000000000000005, 0.25],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfReactions/sbml:reaction[@id='reaction1']/sbml:kineticLaw/sbml:listOfParameters/sbml:parameter[@id='vi']/@value",
            "group": "creation of cyclin rate constants",
            "id": "reaction1/vi",
            "name": "creation of cyclin: vi",
            "description": "",
            "type": "float",
            "value": 0.025,
            "units": null
          }, {
            "recommendedRange": [0.001, 0.1],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfReactions/sbml:reaction[@id='reaction2']/sbml:kineticLaw/sbml:listOfParameters/sbml:parameter[@id='kd']/@value",
            "group": "default degradation of cyclin rate constants",
            "id": "reaction2/kd",
            "name": "default degradation of cyclin: kd",
            "description": "",
            "type": "float",
            "value": 0.01,
            "units": null
          }, {
            "recommendedRange": [0.025, 2.5],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfReactions/sbml:reaction[@id='reaction3']/sbml:kineticLaw/sbml:listOfParameters/sbml:parameter[@id='vd']/@value",
            "group": "cdc2 kinase triggered degration of cyclin rate constants",
            "id": "reaction3/vd",
            "name": "cdc2 kinase triggered degration of cyclin: vd",
            "description": "",
            "type": "float",
            "value": 0.25,
            "units": null
          }, {
            "recommendedRange": [0.002, 0.2],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfReactions/sbml:reaction[@id='reaction3']/sbml:kineticLaw/sbml:listOfParameters/sbml:parameter[@id='Kd']/@value",
            "group": "cdc2 kinase triggered degration of cyclin rate constants",
            "id": "reaction3/Kd",
            "name": "cdc2 kinase triggered degration of cyclin: Kd",
            "description": "",
            "type": "float",
            "value": 0.02,
            "units": null
          }, {
            "recommendedRange": [0.0005, 0.05],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfReactions/sbml:reaction[@id='reaction4']/sbml:kineticLaw/sbml:listOfParameters/sbml:parameter[@id='K1']/@value",
            "group": "activation of cdc2 kinase rate constants",
            "id": "reaction4/K1",
            "name": "activation of cdc2 kinase: K1",
            "description": "",
            "type": "float",
            "value": 0.005,
            "units": null
          }, {
            "recommendedRange": [0.15000000000000002, 15],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfReactions/sbml:reaction[@id='reaction5']/sbml:kineticLaw/sbml:listOfParameters/sbml:parameter[@id='V2']/@value",
            "group": "deactivation of cdc2 kinase rate constants",
            "id": "reaction5/V2",
            "name": "deactivation of cdc2 kinase: V2",
            "description": "",
            "type": "float",
            "value": 1.5,
            "units": null
          }, {
            "recommendedRange": [0.0005, 0.05],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfReactions/sbml:reaction[@id='reaction5']/sbml:kineticLaw/sbml:listOfParameters/sbml:parameter[@id='K2']/@value",
            "group": "deactivation of cdc2 kinase rate constants",
            "id": "reaction5/K2",
            "name": "deactivation of cdc2 kinase: K2",
            "description": "",
            "type": "float",
            "value": 0.005,
            "units": null
          }, {
            "recommendedRange": [0.0005, 0.05],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfReactions/sbml:reaction[@id='reaction6']/sbml:kineticLaw/sbml:listOfParameters/sbml:parameter[@id='K3']/@value",
            "group": "activation of cyclin protease rate constants",
            "id": "reaction6/K3",
            "name": "activation of cyclin protease: K3",
            "description": "",
            "type": "float",
            "value": 0.005,
            "units": null
          }, {
            "recommendedRange": [0.0005, 0.05],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfReactions/sbml:reaction[@id='reaction7']/sbml:kineticLaw/sbml:listOfParameters/sbml:parameter[@id='K4']/@value",
            "group": "deactivation of cyclin protease rate constants",
            "id": "reaction7/K4",
            "name": "deactivation of cyclin protease: K4",
            "description": "",
            "type": "float",
            "value": 0.005,
            "units": null
          }, {
            "recommendedRange": [0.05, 5],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfReactions/sbml:reaction[@id='reaction7']/sbml:kineticLaw/sbml:listOfParameters/sbml:parameter[@id='V4']/@value",
            "group": "deactivation of cyclin protease rate constants",
            "id": "reaction7/V4",
            "name": "deactivation of cyclin protease: V4",
            "description": "",
            "type": "float",
            "value": 0.5,
            "units": null
          }, {
            "recommendedRange": [0.1, 10],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfCompartments/sbml:compartment[@id='cell']/@size",
            "group": "Initial compartment sizes",
            "id": "init_size_cell",
            "name": "Initial size of cell",
            "description": "",
            "type": "float",
            "value": 1,
            "units": "liter"
          }, {
            "recommendedRange": [0.001, 0.1],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='C']/@initialConcentration",
            "group": "Initial species amounts/concentrations",
            "id": "init_concentration_C",
            "name": "Initial concentration of Cyclin",
            "description": "",
            "type": "float",
            "value": 0.01,
            "units": null
          }, {
            "recommendedRange": [0.001, 0.1],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='M']/@initialConcentration",
            "group": "Initial species amounts/concentrations",
            "id": "init_concentration_M",
            "name": "Initial concentration of CDC-2 Kinase",
            "description": "",
            "type": "float",
            "value": 0.01,
            "units": null
          }, {
            "recommendedRange": [0.001, 0.1],
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='X']/@initialConcentration",
            "group": "Initial species amounts/concentrations",
            "id": "init_concentration_X",
            "name": "Initial concentration of Cyclin Protease",
            "description": "",
            "type": "float",
            "value": 0.01,
            "units": null
          }],
          "variables": [{
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='C']",
            "group": "Species amounts/concentrations",
            "id": "C",
            "name": "Cyclin",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='M']",
            "group": "Species amounts/concentrations",
            "id": "M",
            "name": "CDC-2 Kinase",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfSpecies/sbml:species[@id='X']",
            "group": "Species amounts/concentrations",
            "id": "X",
            "name": "Cyclin Protease",
            "description": "",
            "type": "float",
            "units": "mole / liter"
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='V1']",
            "group": "Other",
            "id": "V1",
            "name": "V1",
            "description": "",
            "type": "float",
            "units": null
          }, {
            "identifiers": [],
            "target": "/sbml:sbml/sbml:model/sbml:listOfParameters/sbml:parameter[@id='V3']",
            "group": "Other",
            "id": "V3",
            "name": "V3",
            "description": "",
            "type": "float",
            "units": null
          }],
          "taxon": {
            "id": 8292,
            "name": "Amphibia"
          },
          "framework": {
            "ontology": "SBO",
            "id": "0000293",
            "name": "non-spatial continuous framework",
            "description": "Modelling approach where the quantities of participants are considered continuous, and represented by real values. The associated simulation methods make use of differential equations. The models do not take into account the distribution of the entities and describe only the temporal fluxes.",
            "iri": "http://biomodels.net/SBO/SBO_0000293"
          },
          "format": {
            "id": "SBML",
            "name": "Systems Biology Markup Language",
            "version": "L2V4",
            "edamId": "format_2585",
            "url": "http://sbml.org/",
            "specUrl": "http://identifiers.org/combine.specifications/sbml",
            "mimetype": "application/sbml+xml",
            "extension": "xml",
            "sedUrn": "urn:sedml:language:sbml"
          },
          "metadata": {
            "license": "CC0",
            "authors": [{
              "firstName": "A",
              "middleName": null,
              "lastName": "Goldbeter"
            }],
            "references": {
              "identifiers": [{
                "namespace": "biomodels.db",
                "id": "BIOMD0000000003",
                "url": "http://www.ebi.ac.uk/biomodels/BIOMD0000000003"
              }],
              "citations": [{
                "authors": "A Goldbeter",
                "title": "A minimal cascade model for the mitotic oscillator involving cyclin and cdc2 kinase.",
                "journal": "Proceedings of the National Academy of Sciences of the United States of America",
                "volume": "88",
                "issue": null,
                "pages": "9107-9111",
                "year": 1991,
                "doi": "10.1073/pnas.88.20.9107"
              }],
              "doi": null
            },
            "tags": [],
            "summary": null,
            "description": "<div>      <p>Minimal cascade model for the mitotic oscillator involving cyclin and cdc2 kinase.</p>\n                </div>",
            "name": "Goldbeter1991 - Min Mit Oscil",
            "accessLevel": "public"
          }
        },
        "relationships": {
          "owner": {
            "data": {
              "type": "user",
              "id": "jonrkarr"
            }
          },
          "file": {
            "data": {
              "type": "file",
              "id": "biomd0000000003-file"
            }
          },
          "image": {
            "data": {
              "type": "file",
              "id": "biomd0000000003-thumbnail"
            }
          },
          "parent": {
            "data": null
          }
        },
        "meta": {
          "created": 1593547574024,
          "updated": 1593547574024,
          "version": 1
        }
      }]
    };

    this.models.set('1', response.data[0] as ModelResource);
    this.models.set('2', response.data[1] as ModelResource);
    this.models.set('3', response.data[2] as ModelResource);
    this.loading$.next(false);
    return of(this.models$.next(this.models));

    /*
    return responseObs.pipe(
      pluck('data'),
      map((value: ModelResource[]) => {
        value.forEach((model: ModelResource) => {
          this.models.set(model.id, model);
        });
        this.models$.next(this.models);
      }),
      tap((_) => this.loading$.next(false)),
    );
    */
  }
  private load(id: string) {
    this.loading$.next(true);
    return this.http.get<ModelDocument>(this.url + '/' + id).pipe(
      pluck('data'),
      tap((model: ModelResource) => {
        this.set(id, model);
        this.loading$.next(false);
      }),
    );
  }

  private set(id: string, model: ModelResource) {
    this.models.set(model.id, model);
    this.models$.next(this.models);
  }

  public getAll(): Observable<ModelResource[]> {
    if (!this.firstLoad) {
      this.loadAll().subscribe();
    }
    return this.models$
      .asObservable()
      .pipe(
        map((value: Map<string, ModelResource>) =>
          Array.from(value).map((mapVal) => mapVal[1]),
        ),
      );
  }

  public get(id: string): Observable<ModelResource | undefined> {
    if (this.models.get(id)) {
      return this.models$
        .asObservable()
        .pipe(map((modelMap: Map<string, ModelResource>) => modelMap.get(id)));
    } else {
      this.load(id).subscribe();
      return this.models$
        .asObservable()
        .pipe(map((value: Map<string, ModelResource>) => value.get(id)));
    }
  }

  /**
   * Returns an observable of the current request status
   *
   */
  public isLoading$() {
    return this.loading$.asObservable();
  }
  post() {
    this.http.post<ModelDocument>(this.url, {});
  }
}
