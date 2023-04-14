import React, {useEffect, useRef, useState} from "react";
import {Input} from 'antd';
import {marked} from "marked";
import hljs from 'highlight.js';
// import 'highlight.js/styles/gradient-dark.css';
import 'highlight.js/styles/shades-of-purple.css';

import json from './test.json';
import styles from './index.less';

const {TextArea} = Input;

const Index = () => {
  const [time] = useState(new Date().valueOf());
  const [textValue, setTextValue] = useState('');
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // setChatList(json.list);
  }, []);

  useEffect(() => {
    const renderer = {
      code(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        const codeHtml = hljs.highlight(code, {language}).value;
        return (
          `
            <div class="${styles.code_title}">
              <div class="${styles.lang}">${language}</div>
              <div class="${styles.copy}" id="${code}">复制</div>
            </div>
            <pre><code class="hljs language-${language}">${codeHtml}</code></pre>
          `
        );
      }
    };

    marked.use({renderer});
  }, []);

  useEffect(() => {
    document.body.addEventListener('click', clickCopy);

    return () => {
      document.body.removeEventListener('click', clickCopy);
    };
  }, []);

  const clickCopy = async (event) => {
    if (event.target.className === styles.copy) {
      const code = event.target.id;
      try {
        await navigator.clipboard.writeText(code);
      } catch (err) {
        console.error('复制失败', err);
      }
    }
  };

  const onPressEnter = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      if (textValue !== '' && loading === false) {
        sendMsg(textValue);
      }
    }
  };

  const changeText = (e) => {
    setTextValue(e.target.value);
  };

  const sendMsg = (textValue) => {
    setTextValue('');
    setChatList(state => [...state, {type: 'prompt', value: textValue}]);
    setLoading(true);
    postData('http://localhost:5000/sendMsg/openAI', textValue)
      .then(response => {
        const decoder = new TextDecoder();
        const reader = response.body.getReader();
        let textValue = '';

        read();

        function read() {
          reader.read().then(({done, value}) => {
            if (done) {
              setLoading(false);
              return;
            }
            textValue += decoder.decode(value);
            setChatList(state => {
              if (state.at(-1).type !== 'output') {
                return [
                  ...state,
                  {type: 'output', value: textValue}
                ];
              } else {
                const item = state.at(-1);
                return [
                  ...state.slice(0, length - 1),
                  {...item, value: textValue}
                ];
              }
            });
            read();
          });
        }
      });
  };

  async function postData(url = '', data = '') {
    try {
      return await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({data, time}),
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className={styles.chat}>
      <div className={styles.main}>
        <div className={styles.list}>
          {chatList.map((item, index) => {
            if (item.type === 'prompt') {
              return (
                <div key={index} className={styles.prompt}>
                  <div>输入：</div>
                  <div>{item.value}</div>
                </div>
              );
            }
            if (item.type === 'output') {
              return (
                <div key={index} className={styles.output}>
                  <div className={styles.output_left}>输出：</div>
                  <div className={styles.output_right} dangerouslySetInnerHTML={{__html: `${marked.parse(item.value)}`}}/>
                </div>
              );
            }
          })}
        </div>
        <div className={styles.input}>
          <TextArea autoSize={{minRows: 1, maxRows: 4}} value={textValue} onChange={changeText} onPressEnter={onPressEnter}/>
        </div>
      </div>
    </div>
  );
};

export default Index;
