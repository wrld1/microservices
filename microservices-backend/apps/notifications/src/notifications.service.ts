import { Injectable, Logger } from '@nestjs/common';
import { ProductCreatedEvent, ProductDeletedEvent } from '@app/common';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  handleProductCreated(data: ProductCreatedEvent) {
    this.logger.log(
      `Product created: "${data.name}" (id: ${data.id}, price: ${data.price})`,
    );
  }

  handleProductDeleted(data: ProductDeletedEvent) {
    this.logger.log(`Product deleted: "${data.name}" (id: ${data.id})`);
  }
}
