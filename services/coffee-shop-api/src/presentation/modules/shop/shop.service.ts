import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopEntity } from '../../../infrastructure/persistence/typeorm/entities/shop.entity';
import { UpdateShopDto } from '../../../application/dto/shop/update-shop.dto';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(ShopEntity)
    private shopRepository: Repository<ShopEntity>,
  ) {}

  async findById(id: string): Promise<ShopEntity> {
    const shop = await this.shopRepository.findOne({
      where: { id },
    });

    if (!shop) {
      throw new NotFoundException(`Shop with ID ${id} not found`);
    }

    return shop;
  }

  async update(id: string, updateDto: UpdateShopDto): Promise<ShopEntity> {
    const shop = await this.findById(id);
    Object.assign(shop, updateDto);
    return await this.shopRepository.save(shop);
  }
}

