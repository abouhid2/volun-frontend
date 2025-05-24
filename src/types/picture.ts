export interface Picture {
  id: number;
  image_url: string;
  imageable_type: 'User' | 'Entity' | 'Event';
  imageable_id: number;
  created_at: string;
  updated_at: string;
}

export type PictureType = 'profile' | 'cover' | 'gallery'; 