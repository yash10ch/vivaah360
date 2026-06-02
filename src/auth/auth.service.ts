import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateGoogleUser(profile: any) {
    let user = await this.prisma.users.findUnique({
      where: {
        email: profile.email,
      },
    });

    if (!user) {
      user = await this.prisma.users.create({
        data: {
          email: profile.email,
          first_name: profile.firstName,
          last_name: profile.lastName,
          profile_image: profile.profileImage,
          provider: 'GOOGLE',
          provider_id: profile.providerId,
          role: 'USER',
        },
      });
    }

    const accessToken = await this.generateAccessToken(user);

    const refreshToken = await this.generateRefreshToken(user);

    await this.saveRefreshToken(
      user.id,
      refreshToken,
    );

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  private async generateAccessToken(user: any) {
    return this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: '15m',
      },
    );
  }

  private async generateRefreshToken(user: any) {
    return this.jwtService.signAsync(
      {
        sub: user.id,
      },
      {
        secret:
          process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '30d',
      },
    );
  }

  private async saveRefreshToken(
    userId: string,
    refreshToken: string,
  ) {
    const expiresAt = new Date();

    expiresAt.setDate(
      expiresAt.getDate() + 30,
    );

    await this.prisma.user_sessions.create({
      data: {
        user_id: userId,
        refresh_token: refreshToken,
        expires_at: expiresAt,
      },
    });
  }

  async refreshAccessToken(
    refreshToken: string,
  ) {
    const session =
      await this.prisma.user_sessions.findFirst({
        where: {
          refresh_token: refreshToken,
        },
      });

    if (!session) {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }

    if (session.expires_at < new Date()) {
      throw new UnauthorizedException(
        'Refresh token expired',
      );
    }

    const user =
      await this.prisma.users.findUnique({
        where: {
          id: session.user_id,
        },
      });

    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }

    const accessToken =
      await this.generateAccessToken(
        user,
      );

    return {
      accessToken,
    };
  }

  async logout(refreshToken: string) {
    await this.prisma.user_sessions.deleteMany({
      where: {
        refresh_token: refreshToken,
      },
    });

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
}