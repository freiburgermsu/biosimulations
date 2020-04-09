import { Injectable } from '@nestjs/common';

@Injectable()
export class ResourceRepository {
  resources = [];

  add(resource: any) {
    this.resources.push(resource);
  }

  get(id: string) {
    return this.resources.filter(value => (value.id = id))[0];
  }

  delete(id: string) {
    this.resources = this.resources.filter(value => value.id !== id);
  }
}
