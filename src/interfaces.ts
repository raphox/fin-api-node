import { Request } from "express";

export interface Statement {
  id: string;
  date: Date;
  description: string;
  value: number;
}

export interface Account {
  id: string;
  name: string;
  cpf: string;
  statements: Statement[];
}

export interface RequestCustom extends Request {
  account?: Account;
}
