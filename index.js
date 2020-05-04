const TelegramBot=require('node-telegram-bot-api');
const express= require("express");
const app=express();
var mysql=require("mysql");
var fs= require('fs');
var vorpal=require('vorpal')();

var contutente = fs.readFileSync("Utente.json");
var Utente=[]
Utente=JSON.parse(contutente);
var loggato=false;

/*
//autenticazione del utente 
(non so perchè, vorpal non mi fa accedere l'account,
 però la mia idea è quello di fare accedere account, 
 e quando nome account e password sono corrispondente alle le dati interno jsno, 
 attivare collegamento con bot e partine le commandi )




 
vorpal
.command('logare<login><password>')
.description('login dell utente')
.action((fun,callback)=>{
    // per controllare se l'utente esiste oppure no 
    var Esiste = false;       
    //ricercare utente dentro array
    for(var index in Utente)
    {
        //controllare se utente inserito è uguale al utente in json
        if(fun.login == Utente[index].login)
        {
            Esiste = true;
            //Controllo se la password inserito è uguale al password in json
            if(fun.password == Utente[index].password){
                //messagggio di accesso eseguito
                console.log("Loggin successful ")
                //memorizzare le varibili
                loggato = true;
                
            }
            else{
                //messaggio di errore quando utente o password inserito non sono uguale al untente o password in database
                console.log("errore di inserimento nomeutente oppure password")
               
            }
        }
    }
    if(Esiste == false){
        console.log("Utente inesistente");
    }
    callback();
})
*/


//connection telegram
const token='955222989:AAEQX4bVYynoSeIgnFXzTPHhfiqsd6OBJwU';
const bot =new TelegramBot(token,{
    polling:true
});

//listening port
const port=process.env.PORT;
app.get("/",(req,res)=>{
    Response.send("TELEGRAM esbot");
})
app.listen(port);
//connection database
var conn=mysql.createConnection({
    host :'localhost',
    user : 'root',
    port : '3306',
    database : 'bottelgram'
});

//start command
bot.onText(/\/start/, msg=>{
    bot.sendMessage(msg.from.id, "Hello  " + msg.from.first_name);
})


//cronologia dei calcoli
bot.onText(/\/cronologia/, (msg)=> {
    conn.connect((err)=>{
        var sql='SELECT * FROM lista WHERE user='+conn.escape(msg.chat.id);
    conn.query(sql,(err,result)=>{
        if(err){
            console.log(err.message);
        }
        else{
            var list="";
            for(var i in result){
                list+="id:"+result[i].id+"---"+"calcolo:"+result[i].calcolo+"---"+result[i].risultato+"\n\n"
                console.log(list);
                
            }
            bot.sendMessage(msg.from.id,list)
        }
    })
    })
  });

  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (msg.text.toString().toLowerCase().includes(bye)) {
    bot.sendMessage(msg.chat.id, "arrivedrci");
    } 
  });
  



//calcolatrice con inserimento del calcolo su database
bot.onText(/\/cal (.+)/,  (msg, match)=> {
    // match[1] è la parte dopo /calcolo
    var num = match[1].replace(/[^\d\+\.\-\*\/()]+/g,"");
    // eval è la funzione di calcolo
    num = 'risultato: ' + eval(num);
    bot.sendMessage(msg.from.id, num);
    conn.connect((err)=>{
        var fromid=msg.from.id.toString();
    const m=match[1];
    var  addSql = 'INSERT INTO lista(user,calcolo,risultato) VALUES(?,?,?)';
    var  addSqlParams = [fromid,m,num];
    conn.query(addSql,addSqlParams,(err, result)=> {
        if(err){
         console.log(err.message);
         return;
        }
        else{
            console.log("dati inseriti")
            console.log(fromid,m,num)
        }        
});
    })
});


