import { Module } from '@nestjs/common';
import * as path from 'path';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '/i18n/'),
      },
    }),
  ],
  controllers: [],
})
export class AppModule { }