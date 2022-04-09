import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { RequestCustom, Statement } from "./interfaces";
import { getBalance, verifyIfExistsAccountCpf } from "./utils";
import { accounts } from ".";

const router = express.Router();

router.get("/", (_, response: Response) => {
  return response.json({ message: "Hello, world!" });
});

router.post("/accounts", (request: Request, response: Response) => {
  const { cpf, name } = request.body;

  // check if existing account
  const existingAccount = accounts.find((account) => account.cpf === cpf);

  if (existingAccount) {
    return response.status(400).json({ error: "Account already exists" });
  }

  accounts.push({
    cpf,
    name,
    id: uuidv4(),
    statements: [],
  });

  return response.json(accounts);
});

router.get(
  "/accounts/:cpf",
  verifyIfExistsAccountCpf,
  (request: RequestCustom & { query: { date?: string } }, response) => {
    const { account } = request;

    return response.json(
      (["id", "cpf", "name"] as Array<keyof typeof account>).reduce(
        (obj, key) => {
          obj[key] = account![key];

          return obj;
        },
        {}
      )
    );
  }
);

router.put(
  "/accounts/:cpf",
  verifyIfExistsAccountCpf,
  (request: RequestCustom, response) => {
    const {
      account,
      body: { name },
    } = request;

    if (name) {
      account!.name = name;
    }

    return response.json(account);
  }
);

router.delete(
  "/accounts/:cpf",
  verifyIfExistsAccountCpf,
  (request: RequestCustom & { query: { date?: string } }, response) => {
    const { account } = request;

    accounts.splice(accounts.indexOf(account!), 1);

    return response.status(200).json(account);
  }
);

router.get(
  "/accounts/:cpf/statements",
  verifyIfExistsAccountCpf,
  (request: RequestCustom & { query: { date?: string } }, response) => {
    const { account } = request;
    const { date } = request.query;

    const dateFormatted = new Date(date + "T00:00:00Z");
    let statements: Statement[] = [];

    if (date) {
      statements = account!.statements.filter((statement) => {
        return statement.date.toDateString() === dateFormatted.toDateString();
      });
    } else {
      statements = account!.statements;
    }

    return response.json(
      statements.map((statement) => {
        return (
          ["date", "description", "value"] as Array<keyof Statement>
        ).reduce<Record<string, any>>((obj, key) => {
          obj[key] = statement[key];

          return obj;
        }, {});
      })
    );
  }
);

router.post(
  "/accounts/:cpf/statements",
  verifyIfExistsAccountCpf,
  (request: RequestCustom, response) => {
    const {
      account,
      body: { date, description, value },
    } = request;

    account!.statements.push({
      id: uuidv4(),
      date: new Date(date),
      description,
      value,
    });

    return response.json(account!.statements);
  }
);

router.post(
  "/accounts/:cpf/withdraws",
  verifyIfExistsAccountCpf,
  (request: RequestCustom, response) => {
    const {
      account,
      body: { date, description, value },
    } = request;

    if (getBalance(account!.statements) < value) {
      return response
        .status(400)
        .json({ error: "Account doesn't have enough balance." });
    }

    account!.statements.push({
      id: uuidv4(),
      date: new Date(date),
      description,
      value: -value,
    });

    return response.json(account!.statements);
  }
);

export { router };
