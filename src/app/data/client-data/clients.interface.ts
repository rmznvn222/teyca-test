export interface Client {
  user_id: number;
  template: string;
  fio: string;
  first_name: string;
  last_name: string;
  pat_name: string;
  phone: string;
  sms_verify: boolean;
  email: string;
  birthday: string;
  gender: string;
  city: string;
  car_number: string;
  barcode: string;
  discount: string;
  bonus: string;
  summ: string;
  summ_all: string;
  summ_last: string;
  date_last: string;
  visits_all: string;
  link: string;
  referal: string;
  created_at: string;
}


export interface Meta {
  size: number;
  limit: number;
  offset: number;
}

export interface ClientsResponse {
  meta: Meta;
  passes: Client | Client[];
}