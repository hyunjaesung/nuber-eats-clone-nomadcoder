import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';

// AWS import
import * as AWS from 'aws-sdk';

const BUCKET_NAME = 'ithavetobeuniqueinamazonworld';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly config: ConfigService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    // 키 등록
    AWS.config.update({
      credentials: {
        accessKeyId: this.config.get<string>('ACCESS_KEY_ID'),
        secretAccessKey: this.config.get<string>('SECRET_ACCESS_KEY'),
      },
    });

    try {
      // 버킷 없을때는 일단 이름정해서 하나 생성해야한다
      // 이름은 AWS 중복된 스토리지가 있으면 안된다
      // 생성하고 나면 코드 제거하고 이름만 기억하면 된다
      //   const upload = await new AWS.S3()
      //     .createBucket({ Bucket: 'ithavetobeuniqueinamazonworld' })
      //     .promise();

      // file
      //   {
      //     fieldname: 'file',
      //     originalname: '60aff68f58929975c3a1197e760d88a2.psd',
      //     encoding: '7bit',
      //     mimetype: 'image/vnd.adobe.photoshop',
      //     buffer: <Buffer 38 42 50 53 00 01 00 00 00 00 00 00 00 03 00 00 02 49 00 00 02 49 00 08 00 03 00 00 00 00 00 00 58 a4 38 42 49 4d 04 04 00 00 00 00 00 07 1c 02 00 00 ... 387957 more bytes>,
      //     size: 388007
      //   }
      const fileName = `${Date.now()}${file.originalname}`;
      const upload = await new AWS.S3()
        .putObject({
          Body: file.buffer,
          Bucket: BUCKET_NAME,
          Key: fileName, // 고유한 이름 필요
          ACL: 'public-read', // public-read 설정 해줘야 누구나 파일 읽는거 가능하다
        })
        .promise(); // promise 꼭해야된다

      const fileURL = `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

      return { url: fileURL }; // 프론트 앤드에게 넘길 주소
    } catch (error) {
      return null;
    }
  }
}
