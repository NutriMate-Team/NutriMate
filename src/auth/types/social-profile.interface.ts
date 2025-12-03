import { SocialProvider } from './social-provider.enum';

export interface SocialProfilePayload {
  provider: SocialProvider;
  providerId: string;
  email?: string;
  fullName?: string;
}
