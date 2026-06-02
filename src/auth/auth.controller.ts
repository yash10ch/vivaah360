import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Body, Post } from '@nestjs/common';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() { }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Req() req) {
        return await this.authService.validateGoogleUser(
            req.user,
        );
    }

    @Get('me')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req) {
        return req.user;
    }

    @Post('refresh')
    refreshToken(
        @Body() body: RefreshTokenDto,
    ) {
        return this.authService.refreshAccessToken(
            body.refreshToken,
        );
    }

    @Post('logout')
    logout(
        @Body() body: RefreshTokenDto,
    ) {
        return this.authService.logout(
            body.refreshToken,
        );
    }
}