// Match database tables exactly.

export interface DbMonth {
  name: string;
  createdAt: Date;
}

export interface DbCompany {
  name: string;
  postId: string;
  monthName: string;
  createdAt: Date;
}
