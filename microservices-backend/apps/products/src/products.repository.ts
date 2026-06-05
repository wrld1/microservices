import { Injectable } from '@nestjs/common';
import { Prisma } from './generated/prisma/client';
import { PrismaService } from './prisma.service';
import { CreateProductDto } from './dto';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateProductDto) {
    return this.prisma.product.create({ data });
  }

  findById(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  delete(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  findMany(where: Prisma.ProductWhereInput, skip: number, take: number) {
    return this.prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  count(where: Prisma.ProductWhereInput) {
    return this.prisma.product.count({ where });
  }
}
