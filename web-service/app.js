import express from 'express';
import dotenv from 'dotenv';

import {request} from './openai.js';

dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//设置跨域访问
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', ' 3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

let messages = [{role: "system", content: "你是一个非常厉害的全栈工程师,能提供最简介高效的回答"}];
let oldTime = 0;

app.post('/sendMsg/openAI', async (req, res) => {
  const {data, time} = req.body;

  if (data) {

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    //前端刷新页面时开始新的上下文
    if (oldTime !== time) {
      messages = messages.slice(0, 1);
      oldTime = time;
    }
    //拼接用户消息
    messages = [
      ...messages,
      {role: "user", content: data}
    ];
    const openRes = await request(messages);

    //拼接返回的消息
    messages = [
      ...messages,
      {role: "assistant", content: ''}
    ];

    openRes.data.on('data', data => {
      const regex = /data: (.+?)\n\n/g;
      let matches;
      while ((matches = regex.exec(data.toString())) !== null) {
        const result = matches[1];
        if (result !== '[DONE]') {
          const content = JSON.parse(result).choices[0].delta.content || '';
          messages[messages.length - 1].content += content;
          res.write(content);
        }
      }
    });

    openRes.data.on('end', () => {
      res.end();
    });
  } else {
    res.send(JSON.stringify({
      code: 500,
      msg: '字符串不可为空',
    }));

    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`success on http:127.0.0.1:${PORT}`);
});
