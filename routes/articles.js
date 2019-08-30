const express = require('express');
const router = express.Router();

const Article = require('../models/Article.js');

router.get('/', (req, res, next) => {
  Article.getArticles((err, articles) => {
      res.render('articles', {
        title: 'Articles',
        articles: articles
    });
  });
});

router.get('/show/:id', (req, res, next) => {
  Article.getArticleById(req.params.id, (err, article) => {
    res.render('article', {
      title: 'Article',
      article: article
    });
  });
});

router.get('/category/:category_id', (req, res, next) => {
  Article.getCategoryArticles(req.params.category_id, (err, articles) => {
    Category.getCategoryById(req.params.category_id, (err, category) => {
      res.render('articles', {
        title: category.title+' Articles',
        articles: articles
      });
    });
  });
});

// Add Article - POST
router.post('/add', (req, res, next) => {
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();
  req.checkBody('category', 'Category is required').notEmpty();

  let errors = req.validationErrors();

  if(errors){
    Category.getCategories((err, categories) => {
      res.render('add_article', {
        errors: errors,
        title: 'Create Article',
        categories: categories
      });
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.subtitle = req.body.subtitle;
    article.category = req.body.category;
    article.body = req.body.body;
    article.author = req.body.author;

    Article.addArticle(article, (err, article) => {
      if(err){
        res.send(err);
      }
      req.flash('success', 'Article Added');
      res.redirect('/manage/articles');
    });
  }
});

// Edit Article - POST
router.post('/edit/:id', (req, res, next) => {
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();
  req.checkBody('category', 'Category is required').notEmpty();

  let errors = req.validationErrors();

  if(errors){
    Category.getCategories((err, categories) => {
      res.render('edit_article', {
        errors: errors,
        title: 'Edit Article',
        categories: categories
      });
    });
  } else {
    let article = new Article();
    const query = {_id: req.params.id}
    const update = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      category: req.body.category,
      author: req.body.author,
      body: req.body.body
    }
    Article.updateArticle(query, update, {}, (err, article) => {
      if(err){
        res.send(err);
      }
      req.flash('success', 'Article Updated');
      res.redirect('/manage/articles');
    });
  }
});

// Delete Article - Delete
router.delete('/delete/:id', (req, res, next) => {
  const query = {_id: req.params.id}

  Article.removeArticle(query, (err, article) => {
    if(err){
      res.send(err);
    }
    res.status(200);
  });
});

router.post('/comments/add/:id', (req, res, next) => {
  req.checkBody('comment_subject', 'Subject is required').notEmpty();
  req.checkBody('comment_author', 'Author is required').notEmpty();
  req.checkBody('comment_body', 'Body is required').notEmpty();

  let errors = req.validationErrors();

  if(errors){
    Article.getArticleById(req.params.id, (err, article) => {
      res.render('article', {
        title: 'Article',
        article: article,
        errors: errors
      });
    });
  } else {
    let article = new Article();
    let query = {_id: req.params.id}

    let comment = {
      comment_subject: req.body.comment_subject,
      comment_author: req.body.comment_author,
      comment_body: req.body.comment_body,
      comment_email: req.body.comment_email,
    }

    Article.addComment(query, comment, (err, article) => {
      res.redirect('/articles/show/'+req.params.id);
    });
  }
});

module.exports = router;
