import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
export class LocalUserDto {
  @ApiProperty({ description: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Password must be at least 8 characters, contain at least one lowercase letter, one uppercase letter, one number and one special character',
  })
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  )
  password: string;
}
