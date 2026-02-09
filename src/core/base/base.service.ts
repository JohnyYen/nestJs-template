// src/core/base/base.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { IBaseService } from '../interfaces/service.interface';
import { IBaseRepository } from '../interfaces/repository.interface';

/**
 * Abstract generic service that implements common CRUD operations
 * @template T Entity type
 * @template CreateDto DTO for create operations
 * @template UpdateDto DTO for update operations
 */

@Injectable()
export class BaseService<T, CreateDto, UpdateDto>
  implements IBaseService<T, CreateDto, UpdateDto>
{
  /**
   * @param repository The repository instance for the entity
   */
  constructor(protected readonly repository: IBaseRepository<T>) {}

  /**
   * Retrieves all entities with optional filtering
   * @param options Optional query options (filters, pagination, etc.)
   * @returns Promise with array of entities
   */
  async findAll(options?: any): Promise<T[]> {
    return this.repository.findAll(options);
  }

  /**
   * Finds a single entity by its ID
   * @param id The ID of the entity to find
   * @returns Promise with the found entity
   * @throws NotFoundException if entity doesn't exist
   */
  async findById(id: string): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException(
        `${this.getEntityName()} with id ${id} not found`,
      );
    }
    return entity;
  }

  /**
   * Finds the first entity matching the criteria
   * @param options Query options to filter by
   * @returns Promise with the found entity
   * @throws NotFoundException if no entity matches
   */
  async findOne(options: any): Promise<T> {
    const entity = await this.repository.findOne(options);
    if (!entity) {
      throw new NotFoundException(
        `${this.getEntityName()} not found with the provided criteria`,
      );
    }
    return entity;
  }

  /**
   * Creates a new entity
   * @param data The data to create the entity with
   * @returns Promise with the created entity
   */
  async create(data: CreateDto): Promise<T> {
    return this.repository.create(data as Partial<T>);
  }

  /**
   * Updates an existing entity
   * @param id The ID of the entity to update
   * @param data The data to update the entity with
   * @returns Promise with the updated entity
   */
  async update(id: string, data: UpdateDto): Promise<T> {
    await this.findById(id);
    return this.repository.update(id, data as Partial<T>);
  }

  /**
   * Performs a soft delete on the entity
   * @param id The ID of the entity to soft delete
   * @returns Promise with the soft-deleted entity
   */
  async softDelete(id: string): Promise<T> {
    await this.findById(id);
    return this.repository.softDelete(id);
  }

  /**
   * Performs a hard delete on the entity
   * @param id The ID of the entity to delete
   * @returns Promise that resolves when deletion is complete
   */
  async hardDelete(id: string): Promise<void> {
    await this.findById(id);
    return this.repository.hardDelete(id);
  }

  /**
   * Restores a soft-deleted entity
   * @param id The ID of the entity to restore
   * @returns Promise with the restored entity
   */
  async restore(id: string): Promise<T> {
    return this.repository.restore(id);
  }

  /**
   * Counts entities matching the criteria
   * @param options Optional query options
   * @returns Promise with the count of entities
   */
  async count(options?: any): Promise<number> {
    return this.repository.count(options);
  }

  /**
   * Gets the entity name for error messages
   * @returns The entity name
   */
  protected getEntityName(): string {
    return 'not implemented';
  }
}
