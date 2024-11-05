// Match database tables exactly.

export interface DbMonth {
  name: string;
  createdAt: Date;
}

export interface DbCompany {
  name: string;
  commentId: string;
  monthName: string;
  createdAt: Date;
}
