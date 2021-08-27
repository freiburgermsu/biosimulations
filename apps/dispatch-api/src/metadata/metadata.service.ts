import { SimulationRunMetadataInput } from '@biosimulations/datamodel/api';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SimulationRunModel } from '../simulation-run/simulation-run.model';
import { SimulationRunMetadataModel } from './metadata.model';

const commonProjection = { id: 0, __v: 0 };
@Injectable()
export class MetadataService {
  private logger: Logger = new Logger(MetadataService.name);
  public constructor(
    @InjectModel(SimulationRunMetadataModel.name)
    private metadataModel: Model<SimulationRunMetadataModel>,
    @InjectModel(SimulationRunModel.name)
    private simulationModel: Model<SimulationRunModel>,
  ) {}
  public async getAllMetadata() {
    const metadta = await this.metadataModel.find({}).exec();

    return metadta;
  }

  public async getMetadata(id: string) {
    const metadata = await this.metadataModel
      .findOne({ simulationRun: id }, { id: 0, __v: 0 })
      .lean()
      .exec();

    return metadata;
  }

  public async createMetadata(data: SimulationRunMetadataInput) {
    const metadata = new this.metadataModel(data);
    const sim = await this.simulationModel.findById(data.id);
    if (!sim) {
      //throw new Error('Simulation not found');
    }
    metadata.metadata.map(
      m => {
        if (m.uri == ".") {
          m.uri = data.id
        }
        else if (m.uri.startsWith("./")) {
          m.uri = data.id + m.uri.substring(1)
          
        }
        return m;
      }
    )
    return await metadata.save();
  }
}
