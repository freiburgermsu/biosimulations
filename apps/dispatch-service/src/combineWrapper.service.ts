import {
  CombineArchive,
  COMBINEService,
} from '@biosimulations/combine-api-client';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export class CombineWrapperService {
  public constructor(private service: COMBINEService) {}

  public getArchiveMetadata(file?: Blob, url?: string) {
    return this.service.srcHandlersCombineGetMetadataForCombineArchiveHandlerBiosimulations(
      file,
      url,
    );
  }

  public getManifest(
    file?: Blob,
    url?: string,
  ): Observable<AxiosResponse<CombineArchive>> {
    return this.service.srcHandlersCombineGetManifestHandler(file, url);
  }

  public getSedMlSpecs(
    file?: Blob,
    url?: string,
  ): Observable<AxiosResponse<CombineArchive>> {
    return this.service.srcHandlersCombineGetSedmlSpecsForCombineArchiveHandler(
      file,
      url,
    );
  }
}

export class MockCombineWrapperService {
  public getArchiveMetadata(file?: Blob, url?: string) {
    return 'Metadata';
  }
}