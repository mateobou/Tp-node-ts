const zlib = require('zlib')    
const https = require('https') 
const fs = require('fs');
const Path = require('path'); 
const decompress = require('decompress'); 
const express = require('express'); 
const csv = require('csv-parser'); 
const app = express();

//Fonctions 
function Download() {
      https.get("https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip", (res) => {
          const path = `${__dirname}/data.zip`; 
          const filePath = fs.createWriteStream(path);
          res.pipe(filePath);
          filePath.on('finish',() => {
              filePath.close();
          })
          if(res.statusCode===200 || fs.existsSync(path))
          {
            Unzip()
          }
      })

  }

function LauchAverage(){
    const app = express();
    app.get('/', async function(req, res) {

      let numberTrue = 0;
      let numberTotal = 0;
      fs.createReadStream('csv/StockEtablissementLiensSuccession_utf8.csv')
      .pipe(csv())
      .on('data', (data) => {
          numberTotal++
          if(data.transfertSiege == 'true')
          {
              numberTrue++
          }
      })
      .on('end', ()=>{
        res.status(200).send("average "+numberTrue/numberTotal*100);//On retourne la moyenne au navigateur
      })
    })
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
}
function Unzip(){
  decompress("data.zip", "csv")
    .then(() => {
    //Si la décompression a réussie on lance le serveur 
        LauchAverage()
    })
    .catch((error) => {
      if(fs.existsSync('data.zip')==false){
        Download()
      }
      else{
        Unzip()
      }
    })
}
const port = 3000
//Création d'une route
Unzip()

 


