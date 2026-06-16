export class CreateModuleDto {
  code!: string;
  name!: string;
  description?: string;
  sort_order?: number;
  status?: string;
}
