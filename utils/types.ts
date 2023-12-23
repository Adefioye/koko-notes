export type User = {
  id: string;
  email: string;
  username: String;
  name?: string;
  createdAt: Date;
  notes: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  owner: string;
};
