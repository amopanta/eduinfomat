export class CreateCourseDto {
  tenant_id!: string;
  code!: string;
  name!: string;
  description?: string;
  category?: string;
  instructor_id?: string;
  status?: string;
}
