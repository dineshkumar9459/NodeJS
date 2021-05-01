const express = require('express');
const morgan = require('morgan')
const bodyparser = require('body-parser')
const app = express();
const mongoose = require('mongoose')
const Blog = require('./models/blog');
const User = require('./models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'


//reqister view engine
app.set('view engine', 'ejs');

//mongodb connection
mongoose.connect('mongodb://localhost/testaroo',{
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useCreateIndex: true
});

// mongodb connected or not checking
mongoose.connection.once('open', function(){
    console.log('Connection has been made, now make fireworks...');
}).on('error', function(error){
    console.log('Connection error:', error);
});

//listen for requests
app.listen(3000);


// middleware & static files
app.use(express.static('public'));

app.use((req, res, next) => {
  console.log('new request made:');
  console.log('host: ', req.hostname);
  console.log('path: ', req.path);
  console.log('method: ', req.method);
  next();
});

app.use((req, res, next) => {
  console.log('in the next middleware');
  next();
});

app.use(morgan('dev'));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get('/add-blog', (req, res) => {
  const blog = new Blog({
    title: 'new blog2',
    snippet: 'contact new blog',
    body: 'more contact my new blog'
  })

  blog.save()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/all-blogs', (req, res) => {
  Blog.find()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/all-user', (req, res) => {
  User.find()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/single-blog', (req, res) => {
  Blog.findById('608d09c3a0dfb737e4db0b52')
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});


app.use(bodyparser.json())

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username }).lean()

  if (!user) {
    return res.json({ status: 'error', error: 'Invalid username/password' })
  }

  if (await bcrypt.compare(password, user.password)) {
    // the username, password combination is successful

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username
      },
      JWT_SECRET
    )
    
    return res.json({ status: 'ok', data: token })
  }

  res.json({ status: 'error', error: 'Invalid username/password' })

})

app.post('/api/register', async (req, res) => {
  const { username, password: plainTextPassword } = req.body

  if (!username || typeof username !== 'string') {
    return res.json({ status: 'error', error: 'Invalid username' })
  }

  if (!plainTextPassword || typeof plainTextPassword !== 'string') {
    return res.json({ status: 'error', error: 'Invalid password' })
  }

  if (plainTextPassword.length < 5) {
    return res.json({
      status: 'error',
      error: 'Password too small. Should be atleast 6 characters'
    })
  }

  const password = await bcrypt.hash(plainTextPassword, 10)

  try {
    const response = await User.create({
      username,
      password
    })
    console.log('User created successfully: ', response)
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      return res.json({ status: 'error', error: 'Username already in use' })
    }
    throw error
  }

  res.json({ status: 'ok' })
})

app.get('/', (req, res) => {
	res.redirect('/blogs')
});

app.get('/blogs',(req,res)=>{
  Blog.find().sort({createdAt: -1})
    .then(result => {
      res.render('index',{title: 'All Blogs', blogs: result})
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'login' });
});

app.get('/register', (req, res) => {
  res.render('register', { title: 'register' });
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});