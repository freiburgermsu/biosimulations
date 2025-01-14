import { SimulationRunOutputDatumElement } from '@biosimulations/datamodel/common';

export class OutputData {
  public id!: string;
  public label!: string;
  public shape!: string;
  public type!: string;
  public name!: string;
  public values!: SimulationRunOutputDatumElement[];
}

export class Output {
  public simId!: string;
  public outputId!: string;
  public name!: string;
  public type!: string;
  public data!: OutputData[];
  public created!: string;
  public updated!: string;
}

export class Results {
  public simId!: string;
  public outputs!: Output[];
  public created!: string;
  public updated!: string;
}
