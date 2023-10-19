const fs = require('fs');

function writeIntoNotepad(inputtable, chatgpttable) {

    fs.writeFileSync("./output/answers.txt" ,`${inputtable.q}
    ${inputtable.a} // ${chatgpttable.a}
    ${inputtable.b} // ${chatgpttable.b}
    ${inputtable.c} // ${chatgpttable.c}
    ${inputtable.d} // ${chatgpttable.d}
    
    `, { flag: 'a' })

    console.log(`Zapisano pytanie: ${inputtable.q}`)


}

function writeIntoNotepadError(question) {
    fs.writeFileSync("./output/answers.txt" ,`${question} // pytanie posiada zdjecie D:

    `, { flag: 'a' })
    console.log(`Zapisano pytanie: ${question}`)
}

module.exports = { writeIntoNotepad, writeIntoNotepadError }