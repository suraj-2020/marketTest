var express = require('express');
var Joi = require('joi')
var app = express();
app.use(express.urlencoded({extended :true})); //used to take input from form 
app.use(express.json());
app.set('views','./views');
app.set("view engine","pug");
app.listen(3000);
const pdf = require('html-pdf');
app.use(express.static(__dirname));
app.get('/home',(req,res)=>{  //  To Load the page it takes get request
    res.sendFile(__dirname + "/index.html");
})
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: "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",
  });
const openai = new OpenAIApi(configuration);
const fs = require('fs');
const { platform } = require('os');

var plan="";
app.post('/form',(req,res)=>{
    let name=req.body.name;
    let weight=req.body.weight;
    let age=req.body.age;
    let height=req.body.height;
    openai.createCompletion({
        model: "text-davinci-003",
        prompt: "prepare a 2 day beginner workout and indian vegetarian diet for"+name+"with height"+height+"and age"+age+"and weight of"+weight+"who wants to loose weight. Greet the person before the plan.",
        temperature: 0,
        max_tokens: 500
      }).then(reso=>{plan=reso.data.choices[0].text;res.redirect("/plan");}
        )
    
})
app.get('/plan',(req,res)=>{
    plan = plan.replace(/\n/g, '<br>');
    pdf.create(plan).toFile('./output.pdf', function(err, reso) {
        if (err) return console.log(err);
        console.log(reso); // { filename: '/app/businesscard.pdf' }
      });
    console.log(plan);
    res.send(plan);
})