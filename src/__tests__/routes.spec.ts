import app from "../";
import request from "supertest";

const ACCOUNT_CPF = "12345678901";

describe("Accounts", () => {
  it("should be able to list all account's statement", async () => {
    await request(app).post("/accounts").send({
      cpf: ACCOUNT_CPF,
      name: "Raphael Almeida Araujo",
    });

    const newStatement = {
      date: "2022-04-05T21:38:00.000Z",
      description: "test",
      value: 0.5,
    };

    await request(app)
      .post(`/accounts/${ACCOUNT_CPF}/statements`)
      .send(newStatement);

    const response = await request(app).get(
      `/accounts/${ACCOUNT_CPF}/statements`
    );

    expect(response.body).toEqual(expect.arrayContaining([newStatement]));
  });
});
