/** Index of threads. */

export interface APagination {
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
}
export interface ASearch extends APagination {
  hits: APost[];
}

/** Thread. */

export interface AThread extends APagination {
  hits: AComment[];
}

/** First post of a thread. */

export interface APost {
  // for monthName and original sort
  created_at: string; // ISO date format
  title: string;
  story_id: number;
}

/** Thread posts. */

export interface AComment {
  // html
  comment_text: string;
  // for href
  objectID: string;
  // for first level
  story_id: number;
  parent_id: number;
  // for original sort
  created_at: string;
}
