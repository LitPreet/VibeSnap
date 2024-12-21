export type Iuser = {
	created_at: string;
	display_name: string;
	email: string;
	id: string;
	profile_url: string;
	cover_url: string | null;
	bio: string | null;
} | null;

export interface Post {
	id: string;
	userName?: {
		display_name:string;
	}
	user_id: string;
	text: string | null;
	timestamp: string;
	image_urls: string[];
	video_url: string | null;
	likes_count: number;
	created_at: string;
	updated_at: string;
	is_liked?: boolean;
	likes?: Array<{ user_id: string }>;
}