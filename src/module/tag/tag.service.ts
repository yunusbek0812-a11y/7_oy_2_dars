import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private TagRepo:Repository<Tag>){}

  async create(createTagDto: CreateTagDto, request:any) {
    const foundedTag = await this.TagRepo.findOne({where:{title: createTagDto.title}})

    if(foundedTag) throw new BadRequestException("Tag already exist")

      const tag = this.TagRepo.create({...createTagDto,author:request["user"].id})

    return await this.TagRepo.save(tag)
  }

  async findAll():Promise<Tag[]> {
    return await this.TagRepo.find()
  }


  async findOne(id: number): Promise<Tag> {
    const foundedTag = await this.TagRepo.findOne({
      where: { id },
      relations:{
        author: true
      }
     });

    if (!foundedTag) throw new NotFoundException(`Tag not found`);

    return foundedTag;
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);

    Object.assign(tag, updateTagDto);

    return await this.TagRepo.save(tag);
  }

  async remove(id: number): Promise<Tag> {
    const tag = await this.findOne(id);

    return await this.TagRepo.remove(tag);
  }
}