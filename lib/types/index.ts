export type Iuser = {
	created_at: string;
	display_name: string;
	email: string;
	id: string;
	profile_url: string;
    cover_url: string | null;
	bio: string | null;
} | null;