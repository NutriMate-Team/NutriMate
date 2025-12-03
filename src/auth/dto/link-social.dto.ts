import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SocialProvider } from '../types/social-provider.enum';

export class LinkSocialDto {
  @IsEnum(SocialProvider)
  provider!: SocialProvider;

  @IsString()
  @IsNotEmpty()
  providerUserId!: string;
}
