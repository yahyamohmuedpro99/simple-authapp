import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from './schemas/user.schema';
import { SignUpDto, SignInDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { email, password, name } = signUpDto;

    // Check if user exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await this.userModel.create({
      email,
      name,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = this.generateToken(user._id.toString());

    return { 
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    };
  }

  async signIn(signInDto: SignInDto): Promise<{ token: string, user: { id: string, name: string, email: string } }> {
    const { email, password } = signInDto;

    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user._id.toString());

    return { 
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    };
  }

  private generateToken(userId: string): string {
    const user = this.userModel.findById(userId);
    return jwt.sign(
      { 
        userId,
        name: user.name
      },
      process.env.JWT_SECRET || 'your-secret-key',
      {
        expiresIn: '24h',
      }
    );
  }

  async validateUser(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}