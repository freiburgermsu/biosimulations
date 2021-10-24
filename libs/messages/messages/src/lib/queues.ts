/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import { EnvironmentVariable, Purpose } from '@biosimulations/datamodel/common';

export enum JobQueue {
  dispatch = 'dispatch',
  monitor = 'monitor',
  complete = 'complete',
  fail = 'fail',
  metadata = 'metadata',
  health = 'health',
}

export class MonitorJob {
  slurmJobId!: string;
  simId!: string;
  isPublic!: boolean;
  retryCount!: number;
}

export class DispatchJob {
  simId!: string;
  simulator!: string;
  version!: string;
  fileName!: string;
  cpus!: number;
  memory!: number;
  maxTime!: number;
  envVars!: EnvironmentVariable[];
  purpose!: Purpose;
  isPublic!: boolean;
}

export class CompleteJob {
  simId!: string;
  isPublic!: boolean;
}

export class FailJob {
  simId!: string;
  reason!: string;
}
