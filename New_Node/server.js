const http = require('http');
const fs = require('fs');

const server = http.createServer((req,res) =>{
	console.log(req.url);

	res.setHeader('Content-Type', 'text/html');

	// res.write('<h1>Hello welcome</h1>');
	// res.write('<p>Hello welcome</p>');
	// res.end();

	// send html file

  	// fs.readFile('./views/index.html', (err, data) => {
	  //   if (err) {
	  //     console.log(err);
	  //     res.end();
	  //   }
	  //   //res.write(data);
	  //   res.end(data);
  	// });


  	// routing
  	let path = './views/';
  	switch(req.url){
  		case '/':
  			path += 'index.html';
  			res.statusCode = 200;
  			break;
  		case '/contact':
  			path += 'contact.html';
  			res.statusCode = 200;
  			break;

  		//redirect
  		case '/about':
  			res.statusCode = 301;
  			res.setHeader('Location', '/contact');
  			res.end();
  			break;

  		default:
  			path += '404.html';
  			res.statusCode = 404;
  			break;

  	}

  	fs.readFile(path,(err,data)=>{
  		if (err){
  			console.log(err);
  			res.end();
  		}
  		//res.write(data);
    	res.end(data);

  	})
});


server.listen(3000,'localhost', ()=>{
	console.log('listeing to 3000')
});