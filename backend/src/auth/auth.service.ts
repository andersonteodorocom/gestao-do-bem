import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}


  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      return null;
    }
    const isPasswordMatching = await bcrypt.compare(pass, user.passwordHash);
    if (isPasswordMatching) {
      const { passwordHash, ...result } = user;
      return result;
    } else {
      return null;
    }
  }
  async login(user: any) {
    const payload = {
      sub: user.id, 
      email: user.email,
      role: user.role,
      organizationId: user.organizationId
    };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  async getFullProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['organization'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: number, updateData: any) {
    try {
      console.log('UpdateProfile - userId:', userId);
      console.log('UpdateProfile - updateData:', updateData);

      const user = await this.userRepository.findOne({ where: { id: userId } });
      
      if (!user) {
        throw new Error('User not found');
      }

      console.log('User found:', user.email);

      // Atualizar campos básicos
      if (updateData.fullName !== undefined) {
        user.fullName = updateData.fullName;
      }
      if (updateData.email !== undefined) {
        user.email = updateData.email;
      }
      if (updateData.phone !== undefined) {
        user.phone = updateData.phone || null;
      }

      // Atualizar senha se fornecida
      if (updateData.currentPassword && updateData.newPassword) {
        console.log('Attempting to update password...');
        const isPasswordValid = await bcrypt.compare(updateData.currentPassword, user.passwordHash);
        
        if (!isPasswordValid) {
          console.error('Current password is incorrect');
          throw new Error('Senha atual incorreta');
        }

        const hashedPassword = await bcrypt.hash(updateData.newPassword, 10);
        user.passwordHash = hashedPassword;
        console.log('Password updated successfully');
      }

      await this.userRepository.save(user);
      console.log('User saved successfully');

      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
}
