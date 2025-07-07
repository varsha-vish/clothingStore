import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export class ProductItem {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;
}

@Schema({
  timestamps: true,
  toJSON: { 
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
})
export class Sale extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [ProductItem], required: true })
  products: ProductItem[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ default: () => new Date() })
  saleDate: Date;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);

// Middleware to set saleDate in UTC
SaleSchema.pre('save', function(next) {
  if (!this.saleDate) {
    this.saleDate = new Date();
  }
  next();
});