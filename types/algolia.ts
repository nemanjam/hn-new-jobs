/** Index of threads. */

export interface ASearch {
  hits: APost[];
  // todo: for pagination
  // nbHits: number;
  // page: number;
  // nbPages: number;
  // hitsPerPage: number;
}

/** Thread. */

export interface AThread {
  hits: AComment[];
}

/** First post of a thread. */

export interface APost {
  created_at: string; // ISO date format
  title: string;
  story_id: number;
}

/** Thread posts. */

export interface AComment {
  created_at: string;
  // html
  comment_text: string;
  // for href
  objectID: string;
  // for first level
  story_id: number;
  parent_id: number;
}
