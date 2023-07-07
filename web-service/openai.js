import {Configuration, OpenAIApi} from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.MY_KEY,
});
const openai = new OpenAIApi(configuration);

export const request = async (messages) => {
  console.log(`------分割线------`);
  console.log(messages);
  try {
    return await openai.createChatCompletion({
      model: 'gpt-4',
      messages,
      stream: true
    }, {responseType: 'stream'});
  } catch (e) {
    console.log(e);
    return e;
  }
};


