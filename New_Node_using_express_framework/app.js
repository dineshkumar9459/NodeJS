const express = require('express');

const app = express();

//listen for requests
app.listen(3000);

app.get('/',(req,res)=>{
  // res.send('<p>Hello Welcome</p>');
  res.sendFile('./views/index.html',{ root: __dirname });
});

app.get('/contact',(req,res)=>{
  // res.send('<p>Hello Welcome</p>');
  res.sendFile('./views/contact.html',{ root: __dirname });  
});

//redirect
app.get('/about',(req,res)=>{
  res.redirect('/about');
});


// 404 page
app.use((req,res)=>{
  res.status(404).sendFile('./views/404.html', {root: __dirname});
});

