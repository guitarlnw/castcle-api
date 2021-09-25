import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';
import * as path from 'path';

import { CommonController } from './common.controller';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname),
      },
    }),
  ],
  controllers: [CommonController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [],
})
export class CommonModule {
  constructor() {
    console.log(path.join(__dirname, '/assets/i18n/'))
  }
}
