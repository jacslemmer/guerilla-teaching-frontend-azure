/**
 * Customer-related type definitions
 * Shared between frontend and backend
 */

export interface Customer {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address?: CustomerAddress;
  preferences?: CustomerPreferences;
  createdAt?: Date;
  lastModifiedAt?: Date;
}

export interface CustomerAddress {
  street?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

export interface CustomerPreferences {
  newsletter?: boolean;
  smsNotifications?: boolean;
  emailNotifications?: boolean;
  preferredContactMethod?: 'email' | 'phone' | 'sms';
}

export interface CustomerContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: CustomerAddress;
  preferences?: CustomerPreferences;
}

export interface UpdateCustomerRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: CustomerAddress;
  preferences?: CustomerPreferences;
}