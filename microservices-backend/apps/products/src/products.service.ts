import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Prisma, Product } from './generated/prisma/client';
import {
  NOTIFICATIONS_QUEUE,
  PRODUCT_CREATED,
  PRODUCT_DELETED,
} from '@app/common';
import type { ProductCreatedEvent, ProductDeletedEvent } from '@app/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto, GetProductsDto } from './dto';
import type { PaginatedResponse } from './interfaces/paginated-response';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    @Inject(NOTIFICATIONS_QUEUE) private readonly rmqClient: ClientProxy,
  ) {}

  async createProduct(dto: CreateProductDto): Promise<Product> {
    const product = await this.productsRepository.create(dto);

    this.rmqClient.emit<string, ProductCreatedEvent>(PRODUCT_CREATED, {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price.toNumber(),
    });

    return product;
  }

  async removeProduct(id: string): Promise<Product> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }

    await this.productsRepository.delete(id);

    this.rmqClient.emit<string, ProductDeletedEvent>(PRODUCT_DELETED, {
      id: product.id,
      name: product.name,
    });

    return product;
  }

  async getAllProducts(
    dto: GetProductsDto,
  ): Promise<PaginatedResponse<Product>> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(dto);

    const [data, total] = await Promise.all([
      this.productsRepository.findMany(where, skip, limit),
      this.productsRepository.count(where),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private buildWhereClause(dto: GetProductsDto): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {};

    if (dto.search) {
      where.OR = [
        { name: { contains: dto.search, mode: 'insensitive' } },
        { description: { contains: dto.search, mode: 'insensitive' } },
      ];
    }

    if (dto.minPrice !== undefined || dto.maxPrice !== undefined) {
      where.price = {};
      if (dto.minPrice !== undefined) where.price.gte = dto.minPrice;
      if (dto.maxPrice !== undefined) where.price.lte = dto.maxPrice;
    }

    return where;
  }
}
