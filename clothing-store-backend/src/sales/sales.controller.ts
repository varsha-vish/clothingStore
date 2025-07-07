import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createSaleDto: CreateSaleDto, @Request() req) {
    const sale = await this.salesService.create(req.user.id, createSaleDto);
    return {
      message: 'Sale created successfully',
      sale: sale.toJSON(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async findByUserId(@Param('userId') userId: string, @Request() req) {
    // Users can only access their own sales
    if (req.user.id !== userId) {
      throw new Error('Unauthorized');
    }
    const sales = await this.salesService.findByUserId(userId);
    return {
      sales: sales.map(sale => sale.toJSON()),
    };
  }
}
