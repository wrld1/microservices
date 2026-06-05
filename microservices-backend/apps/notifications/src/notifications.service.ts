import { Injectable, Logger } from '@nestjs/common';
import { ProductCreatedEvent, ProductDeletedEvent } from '@app/common';

@Injectable()
export class NotificationsService {
  private readonly eventLogger = new Logger('Events');

  handleProductCreated(data: ProductCreatedEvent) {
    this.eventLogger.log(
      `Product created: "${data.name}" (id: ${data.id}, price: ${data.price})`,
    );
  }

  handleProductDeleted(data: ProductDeletedEvent) {
    this.eventLogger.log(`Product deleted: "${data.name}" (id: ${data.id})`);
  }
}
