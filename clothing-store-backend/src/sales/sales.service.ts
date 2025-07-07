import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Sale } from './schemas/sale.schema';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<Sale>,
  ) {}

  async create(userId: string, createSaleDto: CreateSaleDto): Promise<Sale> {
    // Calculate total price
    const totalPrice = createSaleDto.products.reduce((sum, product) => {
      return sum + (product.price * product.quantity);
    }, 0);

    const sale = new this.saleModel({
      userId: new Types.ObjectId(userId),
      products: createSaleDto.products,
      totalPrice,
      saleDate: new Date(),
    });

    return sale.save();
  }

  async findByUserId(userId: string): Promise<Sale[]> {
    return this.saleModel.find({ userId: new Types.ObjectId(userId) })
      .sort({ saleDate: -1 })
      .exec();
  }
}