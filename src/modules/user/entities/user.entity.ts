import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    description: 'ID único del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'ID del rol asignado',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  roleId: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Indica si el usuario está eliminado (soft delete)',
    example: false,
  })
  isDeleted: boolean;

  @ApiProperty({
    description: 'Fecha de eliminación (si aplica)',
    example: null,
    required: false,
  })
  deletedAt?: Date;
}
