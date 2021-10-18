import {
  applyDecorators,
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { projectIdRegExp } from './id.regex';

export const ProjectId = createParamDecorator(
  (paramName: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const id = request.params[paramName];
    if (!paramName) {
      throw new BadRequestException('Project Id is required');
    }
    if (id.length < 3) {
      throw new BadRequestException(
        'Project id must be at least 3 characters long',
      );
    }
    if (!projectIdRegExp.test(id)) {
      throw new BadRequestException(
        "Project id must only contain letters, numbers, '_', or '-'",
      );
    }

    return id;
  },
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function ProjectIdParam() {
  return applyDecorators(
    ApiParam({
      name: 'id',
      description: 'Project id',
      type: 'string',
      required: true,
      schema: { minLength: 3 },
    }),
  );
}
