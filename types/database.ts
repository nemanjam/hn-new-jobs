// Match database tables exactly.

export interface DbMonth {
  name: string;
  createdAt: Date;
}

export interface DbCompany {
  name: string;
  link: string;
  monthName: string;
}
