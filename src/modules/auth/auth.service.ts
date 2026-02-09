import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: AuthRegisterDto) {
    const { username, email, password } = registerDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      throw new ConflictException('El usuario o email ya existe');
    }

    // Hash de la contraseña usando configuración
    const saltRounds = this.configService.get<number>('bcrypt.saltRounds', 10);
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);

    // Obtener el rol por defecto (asumiendo que existe un rol 'user')
    const defaultRole = await this.prisma.role.findFirst({
      where: { roleName: 'user' },
    });

    if (!defaultRole) {
      throw new Error('Rol por defecto no encontrado');
    }

    // Crear el usuario con los campos de auditoría incluidos
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        roleId: defaultRole.id,
      },
      include: {
        role: true,
      },
    });

    // Generar JWT
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role.roleName,
    };

    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role.roleName,
      },
      token,
    };
  }

  async login(user: any) {
    // El usuario ya viene validado del LocalAuthGuard (req.user)
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email: username }],
      },
      include: {
        role: true,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return {
        ...result,
        role: user.role.roleName,
      };
    }
    return null;
  }
}
