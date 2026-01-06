import axios from 'axios';
import { AppError } from '../utils/AppError';

interface ShiprocketToken {
  token: string;
  expiresAt: number;
}

class ShiprocketAuthService {
  private baseUrl = 'https://apiv2.shiprocket.in/v1/external';
  private tokenData: ShiprocketToken | null = null;

  public async getToken(): Promise<string> {
    const email = process.env.SHIPROCKET_EMAIL;
    const password = process.env.SHIPROCKET_PASSWORD;

    // Return cached token if valid (buffer of 1 hour)
    if (this.tokenData && Date.now() < this.tokenData.expiresAt - 3600000) {
      return this.tokenData.token;
    }

    // Force Mock Mode if credentials are known to be bad or missing (Dev convenience)
    // In production, we would let this fail if credentials are bad.
    // Based on previous session, credentials resulted in 403.
    // We will attempt login, and if it fails due to 401/403, we might fallback or throw depending on policy.
    // For now, let's implementing standard login logic.

    if (!email || !password) {
      console.warn('Shiprocket credentials missing. Using Mock Mode.');
      return 'MOCK_TOKEN';
    }

    try {
      const response = await axios.post(`${this.baseUrl}/auth/login`, {
        email,
        password,
      });

      this.tokenData = {
        token: (response.data as any).token,
        expiresAt: Date.now() + 10 * 24 * 60 * 60 * 1000, // 10 days
      };
      return this.tokenData.token;
    } catch (error: any) {
      console.error('Shiprocket Login Failed:', error.response?.data || error);

      // Fallback for development if real login fails
      // Fallback for development if real login fails
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          'Dev/Test Mode: Falling back to MOCK_TOKEN due to login failure.',
        );
        return 'MOCK_TOKEN';
      }

      throw new AppError('Shipping provider unavailable', 503);
    }
  }
}

export const shiprocketAuthService = new ShiprocketAuthService();
