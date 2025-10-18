import { IsEmail, IsString, IsNotEmpty, MinLength, IsStrongPassword, IsOptional, IsDateString } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @IsStrongPassword()
    password!: string;

    @IsNotEmpty()
    @IsString()
    fullname!: string;

    @IsOptional()
    @IsString()
    gender?: string;

    @IsOptional()
    @IsDateString()
    dateOfBirth?: string;
}