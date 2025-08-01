import { TicketModel } from '../models/ticket.model.js';
import { generateCode } from '../utils/generateCode.js';

export class PurchaseService {
  constructor({ cartRepository, productRepository }) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
  }

  async completePurchase(cartId, userEmail) {
    const cart = await this.cartRepository.getById(cartId);
    if (!cart) throw new Error('Cart not found');

    let total = 0;
    const productsToBuy = [];
    const rejectedProducts = [];

    for (const item of cart.products) {
      const product = await this.productRepository.getById(item.product._id);
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await this.productRepository.update(product._id, { stock: product.stock });
        total += product.price * item.quantity;
        productsToBuy.push(item);
      } else {
        rejectedProducts.push(item);
      }
    }

    if (productsToBuy.length === 0) {
      return { status: 'failed', message: 'No stock available for any products' };
    }

    const ticket = await TicketModel.create({
      code: generateCode(),
      amount: total,
      purchaser: userEmail
    });

    await this.cartRepository.update(cartId, { products: rejectedProducts });

    return { status: 'success', ticket, rejectedProducts };
  }
}
