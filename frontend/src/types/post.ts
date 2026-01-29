export interface Post {
    id: number;
    title: string;
    content?: string;
    author_id: number;
    author_name: string;
    cover: string | null;
    views: number;
    created_at: string;
    category_name: string;
    category_id?: number;
}

export interface PostListResponse {
    posts: Post[];
    total: number;
    page: number;
    pageSize: number;
}
