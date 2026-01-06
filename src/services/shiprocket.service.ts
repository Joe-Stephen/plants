import axios from 'axios';
import { AppError } from '../utils/AppError';
import { shiprocketAuthService } from './shiprocketAuth.service';

class ShiprocketService {
  private baseUrl = 'https://apiv2.shiprocket.in/v1/external';

  private cache = new Map<string, { data: any; expiresAt: number }>();

  // Private helper to fetch raw serviceability data
  private async fetchServiceabilityRaw(
    pickupPincode: number,
    deliveryPincode: number,
    weight: number,
    length: number,
    breadth: number,
    height: number,
    cod: boolean,
  ) {
    const cacheKey = `${pickupPincode}-${deliveryPincode}-${weight}-${length}-${breadth}-${height}-${cod}`;

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      console.log('Serving serviceability from cache');
      return cached.data;
    }

    const token = await shiprocketAuthService.getToken();

    if (token === 'MOCK_TOKEN') {
      const mockCouriers = [
        {
          courier_name: 'Mock Courier Standard',
          rate: 50,
          etd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          rating: 4.5,
          cod: 1,
        },
        {
          courier_name: 'Mock Courier Express',
          rate: 100,
          etd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          rating: 4.8,
          cod: 1,
        },
      ];

      // Cache mock result
      this.cache.set(cacheKey, {
        data: mockCouriers,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });

      return mockCouriers;
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/courier/serviceability`,
        {
          params: {
            pickup_postcode: pickupPincode,
            delivery_postcode: deliveryPincode,
            weight,
            length,
            breadth,
            height,
            cod: cod ? 1 : 0,
          },
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000, // 5 seconds timeout
        },
      );

      const data = (response.data as any).data;
      if (
        !data ||
        !data.available_courier_companies ||
        data.available_courier_companies.length === 0
      ) {
        throw new AppError(
          'No delivery service available for this location',
          400,
        );
      }

      // Cache raw list for 5 minutes
      this.cache.set(cacheKey, {
        data: data.available_courier_companies,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });

      return data.available_courier_companies;
    } catch (error: any) {
      console.error(
        'Shiprocket Serviceability Check Failed:',
        JSON.stringify(error.response?.data || error.message, null, 2),
      );
      throw new AppError('Unable to calculate shipping', 400);
    }
  }

  // Get list of all shipping rates
  public async getShippingRates(
    pickupPincode: number,
    deliveryPincode: number,
    weight: number,
    length: number = 10,
    breadth: number = 10,
    height: number = 10,
    cod: boolean = false,
  ) {
    const couriers = await this.fetchServiceabilityRaw(
      pickupPincode,
      deliveryPincode,
      weight,
      length,
      breadth,
      height,
      cod,
    );

    // Map and Sort
    const mapped = couriers.map((c: any) => ({
      courier_name: c.courier_name,
      rate: c.rate,
      etd: c.etd,
      rating: c.rating || 0,
      // Handle COD field which might be 0/1 or boolean depending on API version, normalizing to boolean
      cod_available: c.cod === 1,
    }));

    // Sort by Cheapest, then Fastest
    return mapped.sort((a: any, b: any) => {
      if (a.rate !== b.rate) return a.rate - b.rate;
      return new Date(a.etd).getTime() - new Date(b.etd).getTime();
    });
  }

  // Check Serviceability (Best Option) - Preserving legacy signature or logic
  public async checkServiceability(
    pickupPincode: number,
    deliveryPincode: number,
    weight: number, // in kg
    length: number = 10,
    breadth: number = 10,
    height: number = 10,
    cod: boolean = false,
  ) {
    const couriers = await this.fetchServiceabilityRaw(
      pickupPincode,
      deliveryPincode,
      weight,
      length,
      breadth,
      height,
      cod,
    );

    // Logic to pick the "Best" courier (e.g., lowest rate)
    const bestCourier = couriers.reduce((prev: any, curr: any) => {
      return prev.rate < curr.rate ? prev : curr;
    });

    return {
      courier_name: bestCourier.courier_name,
      courier_id: bestCourier.courier_company_id || 'MOCK_ID',
      rate: bestCourier.rate,
      etd: bestCourier.etd,
      cod_available: bestCourier.cod === 1,
    };
  }

  // Create Order in Shiprocket
  public async createOrder(orderData: any) {
    const token = await shiprocketAuthService.getToken();

    if (token === 'MOCK_TOKEN') {
      console.log('Mock Shiprocket Order Created:', orderData);
      return {
        order_id: 'MOCK_SR_ORDER_' + Date.now(),
        shipment_id: 'MOCK_SR_SHIP_' + Date.now(),
      };
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/orders/create/ad_hoc`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        },
      );
      return response.data;
    } catch (error: any) {
      console.error(
        'Shiprocket Order Creation Failed:',
        JSON.stringify(error.response?.data || error.message, null, 2),
      );
      throw new AppError('Failed to place shipping order', 502);
    }
  }

  // Generate AWB
  public async generateAWB(shipmentId: string, courierId: string) {
    const token = await shiprocketAuthService.getToken();

    if (token === 'MOCK_TOKEN') {
      const mockAWB = 'MOCK_AWB_' + Date.now();
      return {
        awb_code: mockAWB,
        tracking_url: `https://shiprocket.co/tracking/${mockAWB}`,
        courier_company_id: courierId,
        shipment_id: shipmentId,
      };
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/courier/assign/awb`,
        { shipment_id: shipmentId, courier_id: courierId },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        },
      );

      return (response.data as any).response.data;
    } catch (error: any) {
      console.error(
        'Shiprocket AWB Generation Failed:',
        JSON.stringify(error.response?.data || error.message, null, 2),
      );
      // We throw but allow the caller to decide to fail the whole process or just log it
      throw new AppError('Failed to generate AWB', 502);
    }
  }
}

export const shiprocketService = new ShiprocketService();
