/**
 * @file Contains the controller for CRUD operations on simulation run logs
 * @author Bilal Shaikh
 * @copyright BioSimulations Team 2021
 * @license MIT
 */
import {
  Body,
  Controller,
  // Delete,
  Get,
  Logger,
  // NotImplementedException,
  Param,
  Query,
  // Patch,
  Post,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiPayloadTooLargeResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import {
  CombineArchiveLog,
  SedPlot2DLog,
  SedPlot3DLog,
  SedReportLog,
} from '@biosimulations/ontology/datamodel';
import { CombineArchiveLog as ICombineArchiveLog } from '@biosimulations/datamodel/common';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import { LogsService } from './logs.service';
import { permissions } from '@biosimulations/auth/nest';
import { LeanDocument } from 'mongoose';
import { scopes } from '@biosimulations/auth/common';

@ApiExtraModels(SedReportLog, SedPlot2DLog, SedPlot3DLog)
@Controller('logs')
@ApiTags('Logs')
export class LogsController {
  private logger = new Logger(LogsController.name);

  // eslint-disable-next-line @typescript-eslint/no-parameter-properties
  public constructor(private service: LogsService) {}

  /*
  @ApiOperation({
    summary: 'Get the logs of all simulation runs',
    description: 'Get the logs of all simulation runs',
  })
  @Get()
  public getAllLogs(): void {
    throw new NotImplementedException('Not Implemented');
  }
  */

  @Post('validate')
  @ApiOperation({
    summary: 'Validate a log for a simulation run',
    description: 'Validate a log for a simulation run',
  })
  @ApiBody({
    description: 'Log for a simulation run',
    type: CombineArchiveLog,
  })
  @ApiPayloadTooLargeResponse({
    type: ErrorResponseDocument,
    description:
      'The submitted log is too large. Logs must be less than the server limit.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description:
      'The log for the simulation run is invalid. See https://docs.biosimulations.org/concepts/conventions/ and https://api.biosimulations.org for examples and documentation.',
  })
  @ApiNoContentResponse({
    description: 'The log is valid',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async validateLog(@Body() doc: CombineArchiveLog): Promise<void> {
    await this.service.validateLog(doc);
    return;
  }

  @ApiOperation({
    summary: 'Get the log a simulation run',
    description: 'Get the log a simulation run',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiQuery({
    name: 'includeOutput',
    description: 'Whether to include the standard output and error',
    required: false,
    type: Boolean,
  })
  @ApiOkResponse({
    description: 'The log for a simulation run was sucessfully retrieved',
    type: CombineArchiveLog,
  })
  @ApiNotFoundResponse({
    description: 'No log exists for the requested simulation run id',
    type: ErrorResponseDocument,
  })
  @Get(':runId')
  public async getLog(
    @Param('runId') runId: string,
    @Query('includeOutput') includeOutput = 'true',
  ): Promise<LeanDocument<ICombineArchiveLog>> {
    const structLogs = await this.service.getLog(
      runId,
      includeOutput !== 'false',
    );
    return structLogs;
  }

  /*
  @ApiOperation({
    summary: 'Download the log of a simulation run',
    description: 'Download the log of a simulation run',
  })
  @Get(':runId/download')
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiTags('Downloads')
  public downloadLog(@Param('runId') runId: string): void {
    throw new NotImplementedException('Not Implemented');
  }
  */

  @ApiOperation({
    summary: 'Save the log for a simulation run to the database',
    description: 'Save the log for a simulation run to the database',
  })
  @Post(':runId')
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiBody({
    description: 'The logs for the simulation run',
    type: CombineArchiveLog,
  })
  @ApiPayloadTooLargeResponse({
    type: ErrorResponseDocument,
    description:
      'The submitted log is too large. Logs must be less than the server limit.',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'This account does not have permission to write logs',
  })
  @permissions(scopes.logs.create.id)
  @ApiCreatedResponse({
    description: 'The logs for the simulation run were successfully saved',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description:
      'The log is invalid. See https://docs.biosimulations.org/concepts/conventions/ and https://api.biosimulations.org for examples and documentation.',
  })
  @ApiConflictResponse({
    type: ErrorResponseDocument,
    description:
      'The log could not be saved because the database already includes a log for the simulation run.',
  })
  public async createLog(
    @Param('runId') runId: string,
    @Body() body: CombineArchiveLog,
  ): Promise<void> {
    const log = await this.service.createLog(runId, body);
  }

  @ApiOperation({
    summary: 'Delete the log for a simulation run',
    description: 'Delete the log for a simulation run',
  })
  // @Delete(':runId')
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiNoContentResponse({
    description: 'The log was successfully deleted',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'No log has the requested run id',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'This account does not have permission to delete logs',
  })
  @permissions(scopes.logs.delete.id)
  @HttpCode(HttpStatus.NO_CONTENT)
  public deleteLog(@Param('runId') runId: string): Promise<void> {
    return this.service.deleteLog(runId);
  }

  @ApiOperation({
    summary: 'Replace the log for a simulation run',
    description: 'Replace the log for a simulation run',
  })
  @Put(':runId')
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiBody({
    description: 'The logs for the simulation run',
    type: CombineArchiveLog,
  })
  @ApiPayloadTooLargeResponse({
    type: ErrorResponseDocument,
    description:
      'The submitted log is too large. Logs must be less than the server limit.',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponseDocument,
    description: 'A valid authorization was not provided',
  })
  @ApiForbiddenResponse({
    type: ErrorResponseDocument,
    description: 'This account does not have permission to write logs',
  })
  @permissions(scopes.logs.update.id)
  @ApiOkResponse({
    description:
      'The specifications of the version of the simulation tool were successfully modified',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'No simulation tool has the requested id',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDocument,
    description:
      'The log is invalid. See https://docs.biosimulations.org/concepts/conventions/ and https://api.biosimulations.org for examples and documentation.',
  })
  public async replaceLog(
    @Param('runId') runId: string,
    @Body() body: CombineArchiveLog,
  ): Promise<void> {
    await this.service.replaceLog(runId, body);
    return;
  }
}
