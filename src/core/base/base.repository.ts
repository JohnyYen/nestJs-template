// src/core/base/prisma-base.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IBaseRepository } from '../interfaces/repository.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaBaseRepository<T> implements IBaseRepository<T> {
  protected prismaDelegate: any;

  constructor(protected readonly prisma: PrismaService) {}

  async findAll(options?: Prisma.SelectSubset<T, any>): Promise<T[]> {
    return this.prismaDelegate.findMany(options);
  }

  async findById(id: string): Promise<T | null> {
    return this.prismaDelegate.findUnique({
      where: { id },
    });
  }

  async findOne(options: Prisma.SelectSubset<T, any>): Promise<T | null> {
    return this.prismaDelegate.findFirst(options);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.prismaDelegate.create({
      data,
    });
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return this.prismaDelegate.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<T> {
    return this.prismaDelegate.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isDeleted: true,
      },
    });
  }

  async hardDelete(id: string): Promise<void> {
    await this.prismaDelegate.delete({
      where: { id },
    });
  }

  async restore(id: string): Promise<T> {
    return this.prismaDelegate.update({
      where: { id },
      data: { deletedAt: null, isDeleted: false },
    });
  }

  async count(options?: Prisma.SelectSubset<T, any>): Promise<number> {
    return this.prismaDelegate.count(options);
  }
}
