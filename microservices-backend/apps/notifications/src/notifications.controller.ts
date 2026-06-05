import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  PRODUCT_CREATED,
  PRODUCT_DELETED,
} from '@app/common';
import type { ProductCreatedEvent, ProductDeletedEvent } from '@app/common';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  @EventPattern(PRODUCT_CREATED)
  handleProductCreated(@Payload() data: ProductCreatedEvent) {
    this.notificationsService.handleProductCreated(data);
  }

  @EventPattern(PRODUCT_DELETED)
  handleProductDeleted(@Payload() data: ProductDeletedEvent) {
    this.notificationsService.handleProductDeleted(data);
  }
}
