export interface PushRequest {
  user_id: string;
  push_message: string;
  date_start?: string; 
}

export interface PushResponse {
  users_count: number;
  message_id: number;
}