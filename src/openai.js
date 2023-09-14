import OpenAI from "openai";
//const {Configuration, OpenAIApi} = require('openai');
import openAIKey from './config.env';
import axios from 'axios';
const openai = new OpenAI({
  apiKey: openAIKey.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function sendMsgToOpenAI(message,updateMsg,msg,currentChatRoom){
  const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages:[
          {"role": "user", "content": message }
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true
  });

  let response = '';
  for await (const chunk of stream) {
      if (chunk.choices[0].delta.content) {
          response += chunk.choices[0].delta.content;
          updateMsg(...msg,response);
      }
  }
  if(currentChatRoom === undefined || currentChatRoom === "0"){
    return;
  }
  const data = {
    Question: message,
    Answer: response,
    roomID: currentChatRoom,
  };

  return await axios
    .post('http://localhost:5000/api/chats', data)
    .then((savedResponse) => {
      console.log('Inserted chat:', savedResponse.data);
      return savedResponse;
    })
    .catch((error) => {
      console.error('Axios error:', error);
    });

}
