const fs = require("node:fs");
const path = require("node:path");
let outputs = require("./outputs/output10.json");

outputs.forEach((chap) => {
  let data = ``;
  chap.answers.map((ans) => {
    data += `**${ans.number + 1}**\n`;
    let previous;
    data += ans.answer
      .map((block) =>{
          if(!block.text.includes("!")) 
          {

              if(block.type === "P"){
                  if(!previous?.includes(block.text)) 
                  return block.text
                else return ""
            }
            else if( block.type === "LI" ){
                if(!previous?.includes(block.text)) 
                {
                    previous= block.text
                    return `- ` + block.text;
                }
                else return ""
            }
        }
        }
      )
      .join("\n")
      data +=`\n\n`
  });
  fs.writeFileSync(
    path.join(__dirname, "./output/unitTen", `${chap.chapter}.txt`),
    data
  );
});
