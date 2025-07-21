import express from "express";

const app = express();
const port = 3000;
const blogPostsMem = [];

//Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//Routes
app.get("/", (req, res) => {

  res.render("index.ejs", { blogPostsMem: [...blogPostsMem].reverse(),  //This way the original stays unchanged. 
    topPostsBlog: blogPostsMem.slice(-3)
  });
});

app.get("/create", (req, res) => {
  res.render("uploadPost.ejs");
});

app.post("/upload", (req, res) => {
    console.log("Processing form");
    let blogPost;

    let blogMatch = blogPostsMem.filter(b => String(b.id) === req.body['idBlog']);
    console.log(blogMatch);
    if (blogMatch.length === 0) {

        blogPost = {
            title: req.body["title"],
            text: req.body["story"],
            id: new Date().getTime(),
        };

        blogPostsMem.push(blogPost);

    } else {

        blogPost = {
            title: req.body["title"],
            text: req.body["story"],
            id: req.body['idBlog']
        };

        let indexMatch = blogPostsMem.findIndex(b => String(b.id) === req.body['idBlog']);
        blogPostsMem[indexMatch] = blogPost;
    };

    res.redirect("/"); // Go to the home page showing the Story added on top.
});

app.post("/edit/:id", (req, res) => {
  let idBlog = req.params.id;

  let postEdit = blogPostsMem.filter((e) => {
    return String(e.id)=== String(idBlog);
  });

  res.render("uploadPost.ejs", {blog: postEdit[0]});
});

app.post('/delete/:id', (req, res) => {
    let idBlog = req.params.id;

    let indexMatch = blogPostsMem.findIndex(b => String(b.id) === idBlog);

    blogPostsMem.splice(indexMatch, 1);   

    res.render('index.ejs', {blogPostsMem: blogPostsMem});
})

app.get('/blog/:id', (req, res) => {
    let blogId = req.params.id;

    let blogPost = blogPostsMem.filter(b => String(b.id) === String(blogId))

    res.render('blogPost.ejs', {blogPost: blogPost[0]});
});

app.listen(port, () => {
  console.log(`The app is being served at port ${port}`);
});
