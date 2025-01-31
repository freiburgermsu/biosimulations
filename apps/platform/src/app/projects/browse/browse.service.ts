import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ProjectSummary } from '@biosimulations/datamodel/common';
import { FormattedProjectSummary } from './browse.model';
import { ProjectService } from '@biosimulations/angular-api-client';
import { BiosimulationsError } from '@biosimulations/shared/error-handler';
import { HttpStatusCode } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BrowseService {
  public DEFAULT_THUMBNAIL =
    './assets/images/default-resource-images/model-padded.svg';

  public constructor(private projectService: ProjectService) {}
  public getProjects(): Observable<FormattedProjectSummary[]> {
    const metadatas: Observable<FormattedProjectSummary[]> = this.projectService
      .getProjectSummaries()
      .pipe(
        map((projects: ProjectSummary[]) => {
          return projects
            .map((project: ProjectSummary): FormattedProjectSummary => {
              const run = project.simulationRun;
              const simulationRun = run.run;
              if (!run.metadata) {
                throw new BiosimulationsError(
                  'Project summary not found',
                  `We're sorry! An error occurred while retrieving a summary of project ${project.id}.`,
                  HttpStatusCode.InternalServerError,
                );
              }
              const metadata = run.metadata;

              const thumbnail = metadata?.thumbnails?.length
                ? metadata?.thumbnails[0]
                : this.DEFAULT_THUMBNAIL;

              return {
                id: project.id,
                title: metadata.title || project.id,
                simulationRun: {
                  id: run.id,
                  name: run.name,
                  simulator: simulationRun.simulator.id,
                  simulatorName: simulationRun.simulator.name,
                  simulatorVersion: simulationRun.simulator.version,
                  cpus: simulationRun.cpus,
                  memory: simulationRun.memory,
                  envVars: simulationRun.envVars,
                  runtime: simulationRun.runtime as number,
                  projectSize: simulationRun.projectSize as number,
                  resultsSize: simulationRun.resultsSize as number,
                  submitted: this.formatDate(run.submitted),
                  updated: this.formatDate(run.updated),
                },
                tasks: run.tasks || [],
                outputs: run.outputs || [],
                metadata: {
                  abstract: metadata?.abstract,
                  description: metadata?.description,
                  thumbnail: thumbnail,
                  keywords: metadata.keywords,
                  taxa: metadata.taxa,
                  encodes: metadata.encodes,
                  identifiers: metadata.identifiers,
                  citations: metadata.citations,
                  creators: metadata.creators,
                  contributors: metadata.contributors,
                  license: metadata?.license,
                  funders: metadata.funders,
                  other: metadata.other,
                  locationPredecessors: metadata.locationPredecessors,
                  created: this.formatDate(metadata.created),
                  modified: metadata?.modified
                    ? this.formatDate(metadata?.modified)
                    : undefined,
                },
                owner: project?.owner,
                created: this.formatDate(project.created),
                updated: this.formatDate(project.updated),
              };
            })
            .sort(
              (
                a: FormattedProjectSummary,
                b: FormattedProjectSummary,
              ): number => {
                return a.title.localeCompare(b.title, undefined, {
                  numeric: true,
                });
              },
            );
        }),
      );
    return metadatas;
  }

  private formatDate(date: string): Date {
    return new Date(date);
  }
}
