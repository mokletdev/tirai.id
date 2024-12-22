export type Courier = {
  code: string;
  name: string;
  service: string;
  type: string;
  price: string;
  estimated: string;
};

export type BinderbyteApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};
