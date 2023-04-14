import {Configuration, OpenAIApi} from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.APIKEY,
});
const openai = new OpenAIApi(configuration);

export const request = async (messages) => {
  console.log(`------分割线------`);
  console.log(messages);
  return await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
    stream: true
  }, {responseType: 'stream'});
};


