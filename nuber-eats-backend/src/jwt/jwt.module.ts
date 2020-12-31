import { Module, DynamicModule, Global } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtModuleOptions } from './jwt.interfaces';
import { CONFIG_OPTIONS } from 'src/common/common.constant';

@Global() // 글로벌 선언
@Module({})
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    // forRoot는 potato
    console.log('opititititon', options);
    return {
      module: JwtModule,
      exports: [JwtService],
      // JwtService를 Export해서 다른 모듈에서도 사용 할수 있게 함
      providers: [
        // {
        //   provide: JwtService,
        //   useClass: JwtService,
        // },
        // 그냥 JwtService

        // 커스텀 provider 생성
        {
          provide: CONFIG_OPTIONS, // provider 이름
          useValue: options, // 그 value
          // useClass 쓰면 class inject가능
        },
        JwtService,
      ],
    };
  }
}
