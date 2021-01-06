import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user.entity';

export type AllowedRoles = keyof typeof UserRole | 'Any';

// 데코레이터 만들기
export const Role = (roles: AllowedRoles[]) =>
  SetMetadata('allowedRole', roles);
