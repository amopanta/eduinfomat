import { Injectable } from '@nestjs/common';

@Injectable()
export class RbacService {
  can(_userId: string, _permissionCode: string): boolean {
    return true;
  }
}
