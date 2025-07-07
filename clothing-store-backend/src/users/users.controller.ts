import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      message: 'User created successfully',
      user: user.toJSON(),
    };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(loginUserDto.username, loginUserDto.password);
    const token = this.authService.login(user);
    return {
      message: 'Login successful',
      ...token,
      user: user.toJSON(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    // Users can only access their own data
    if (req.user.id !== id) {
      throw new Error('Unauthorized');
    }
    const user = await this.usersService.findById(id);
    return user.toJSON();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    // Users can only update their own data
    console.log('Request user ID:', req.user.id);
    if (req.user.id !== id) {
      throw new Error('Unauthorized');
    }
    const user = await this.usersService.update(id, updateUserDto);
    return {
      message: 'User updated successfully',
      user: user.toJSON(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    // Users can only delete their own data
    if (req.user.id !== id) {
      throw new Error('Unauthorized');
    }
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }
}