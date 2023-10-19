const puppeteer = require('puppeteer');

async function getAllQuestions(page, browser) {
    var questions = page.evaluate(() => {

        var pytania = document.querySelectorAll("#cnt-wrapper > div.container-wrapper > div > div > .question");
        var tablica = [];
        
        
        pytania.forEach((p) => {
            if(!p.querySelector('.image')) {
                
                var array = {
                    Q: p.querySelector('.title').textContent,
                    A: p.querySelectorAll('.answer')[0].textContent,
                    B: p.querySelectorAll('.answer')[1].textContent,
                    C: p.querySelectorAll('.answer')[2].textContent,
                    D: p.querySelectorAll('.answer')[3].textContent,
                    CORRECT: p.querySelector('.answer.correct').textContent
                }
                
            } else {
                
                var array = {
                    ERR: "pytanie posiada zdjecie",
                    Q: p.querySelector('.title').textContent,
                }
                
            }
            tablica.push(array);
        })

        return tablica;
    })

    return questions;
}

module.exports = { getAllQuestions }