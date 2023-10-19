const puppeteer = require('puppeteer');
const axios = require('axios');
const config = require('./config.json');
const OpenAI = require('openai');
const input = require('input');

const {getAllQuestions} = require('./functions/getAllQuestions.js');
const {writeIntoNotepad, writeIntoNotepadError} = require('./functions/writeIntoNotepad.js');

const openai = new OpenAI({
    apiKey: config.tokenchatgpt
  });


var args = process.argv;

if(!args[2]) {
  console.log('musisz podac numer pytania od ktorego chcesz zaczac (node index.js [numer])');
} else {
  console.log(`Zacznynam od pytania numer ${args[2]}`)
  main(args[2] - 1);
}


async function main(firstnumber) {
    await puppeteer.launch({headless: "new"}).then(async browser => {
        const page = await browser.newPage();
        await page.goto('https://www.praktycznyegzamin.pl/inf03ee09e14/teoria/wszystko/');

        await page.waitForSelector('#cnt-wrapper > div.container-wrapper > div > div > .question');
    
        const questions = await getAllQuestions(page, browser);
        await browser.close();

        for (i = firstnumber; i <= questions.length; i++) {
          if(!questions[i].ERR) {
            var prompt = `
            Napisze ci poniżej pytanie oraz 4 odpowiedzi wraz z poprawną odpowiedzia.
            Twoim zadaniem jest opisać te punkty co robia i jak działają w krótki, prosty oraz przystępny sposób.
    
            ${questions[i].Q}
            ${questions[i].A}
            ${questions[i].B}
            ${questions[i].C}
            ${questions[i].D}
            Poprawna odpowiedź: ${questions[i].CORRECT}
            
            Wszystko zapisz w pliku JSON w takim schemacie
            jako plik JSON tak jak na tym schemacie:
                    {
                        "a": "tutaj napisz twoj opis punktu A"
                        "b": "tutaj napisz twoj opis punktu B"
                        "c": "tutaj napisz twoj opis punktu C"
                        "d": "tutaj napisz twoj opis punktu D"
                    }
            `
    
            console.log(prompt)
            console.log('----------------------');
    
            const chatCompletion = await openai.chat.completions.create({
              messages: [{ role: 'user', content: prompt }],
              model: 'gpt-3.5-turbo',
            });
    
            var inputtable = {
              a: questions[i].A,
              b: questions[i].B,
              c: questions[i].C,
              d: questions[i].D,
              q: questions[i].Q
            }
    
            console.log(inputtable)
    
            var chatgpttable = JSON.parse(chatCompletion.choices[0].message.content);
    
            await writeIntoNotepad(inputtable, chatgpttable);
          } else {
            writeIntoNotepadError(questions[i].Q)
          }
        }

    
    });
}

