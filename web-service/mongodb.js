import {MongoClient} from 'mongodb';

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

export const create = async () => {
  const res = await client.db("chatHistory").collection("chat").insertOne({});
};

//查询
export const read = async (client) => {
  const res = await client.db("chatHistory").collection("chat").find({chatId: 1});
  console.log(res);
};

//修改数据
export const update = async (client, type) => {
  const oneData = {
    chatId: 1,
    role: 'user',
    content: '请问1加1等于几',
  };

  const manyData = [
    {chatId: 1, role: "user", content: "请问1加1等于几"},
    {chatId: 1, role: "assistant", content: "等于2"},
    {chatId: 1, role: "user", content: "再加1呢"},
    {chatId: 1, role: "assistant", content: "等于3"},
  ];

  type === 'one' && await client.db("chatHistory").collection("chat").insertOne(oneData);
  type === 'many' && await client.db("chatHistory").collection("chat").insertMany(manyData);

};
