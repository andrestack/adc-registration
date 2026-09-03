export interface Participant {
  _id: string;
  fullName: string;
  email: string;
}

export interface EmailApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  recipientCount?: number;
  invalidRecipients?: string[];
  errors?: Array<{
    message: string;
    path: (string | number)[];
  }>;
}
