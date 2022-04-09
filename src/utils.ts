import { Response } from "express";

import { RequestCustom, Statement } from "./interfaces";
import { accounts } from ".";

export function verifyIfExistsAccountCpf(
  request: RequestCustom,
  response: Response,
  next: Function
) {
  const { cpf } = request.params;

  const account = accounts.find((account) => account.cpf === cpf);

  if (!account) {
    return response.status(400).json({ error: "Account not found" });
  }

  request.account = account;

  return next();
}

export function getBalance(statement: Statement[]) {
  return statement.reduce((acc, curr) => {
    return acc + curr.value;
  }, 0);
}
