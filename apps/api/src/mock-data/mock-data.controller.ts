import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MockDataService } from './mock-data.service';

@ApiTags('mock')
@Controller('mock')
export class MockDataController {
  constructor(private mock: MockDataService) {}

  @Get('status')
  status() {
    return { simulation: 'active', provider: 'mock' };
  }

  @Post('generate')
  generate() {
    return this.mock.generateMockData();
  }
}
