const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var Book = require('../models/book');


var async = require('async');

//exports.index = function(req, res) {
//    res.send('NOT IMPLEMENTED: Site Home Page');
//};
exports.index = function(req, res) {      
    async.parallel({
        book_count: function(callback) {
            Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        }, 
    }, function(err, results) {
        res.render('index', { title: 'A&C 無責書評佐羅力', error: err, data: results });
    });
};

// Display list of all books.
exports.book_list = function(req, res, next) {
  //Book.find({}, 'title')
  Book.find({}, 'no title status').sort({'no':1})
    .exec(function (err, list_books) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('book_list', { title: 'Book List', book_list: list_books });
    });
};

// Display detail page for a specific book.
exports.book_detail = function(req, res, next) {

    async.parallel({
        book: function(callback) {

            Book.findById(req.params.id)
              .exec(callback);
        },
  
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.book==null) { // No results.
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('book_detail', { title: results.book.title, book: results.book  } );
    });

};

// Display book create form on GET.
exports.book_create_get = function(req, res, next) { 
      
    // Get all authors and genres, which we can use for adding to our book.
    /*async.parallel({
        authors: function(callback) {
            Author.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
    });
    */
    res.render('book_form', { title: 'Create Book'});
};

// Handle book create on POST.
exports.book_create_post = [
    // Convert the genre to an array.
 /*   (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
        }
        next();
    },  */
 
    // Validate fields.
    body('no', 'NO must not be empty.').trim().isLength({ min: 1 }),
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
    //body('author', 'Author must not be empty.').trim().isLength({ min: 1 }),
    body('review_star', 'STAR must not be empty.').trim().isLength({ min: 1 }),
    body('review_summary', 'Summary must not be empty.').trim().isLength({ min: 1 }),
  
    // Sanitize fields (using wildcard).
    sanitizeBody('*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var book = new Book(
          { no: req.body.no,
            title: req.body.title,
            author: req.body.author,
            status: req.body.status,
            review_star: req.body.review_star,
            review_summary: req.body.review_summary,
            review_date: req.body.review_date
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            return;
        }
        else {
            // Data from form is valid. Save book.
            book.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
                   res.redirect(book.url);
                });
        }
    }
];

// Display book delete form on GET.
exports.book_delete_get = function(req, res, next) {

    async.parallel({
        book: function(callback) {
            Book.findById(req.params.id).exec(callback)
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.book==null) { // No results.
            res.redirect('/catalog/books');
        }
        // Successful, so render.
        res.render('book_delete', { title: 'Delete Book', book: results.book } );
    });
    
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res, next) {

    async.parallel({
        book: function(callback) {
          Book.findById(req.body.bookid).exec(callback)
        },

    }, function(err, results) {
        if (err) { return next(err); }
        // Success

        // Book has no book_instances. Delete object and redirect to the list of books.
        Book.findByIdAndRemove(req.body.bookid, function deleteBook(err) {
            if (err) { return next(err); }
            // Success - go to book list
            res.redirect('/catalog/books')
        })

    });
    
};

// Display book update form on GET.
exports.book_update_get = function(req, res, next) {

    // Get book, authors and genres for form.
    async.parallel({
        book: function(callback) {
            Book.findById(req.params.id).exec(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.book==null) { // No results.
                var err = new Error('Book not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            res.render('book_form', { title: 'Update Book', book: results.book });
        });

};

// Handle book update on POST.
exports.book_update_post = [
    
    // Validate fields.
    body('no', 'NO must not be empty.').trim().isLength({ min: 1 }),
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
    //body('author', 'Author must not be empty.').trim().isLength({ min: 1 }),
    body('review_star', 'STAR must not be empty.').trim().isLength({ min: 1 }),
    body('review_summary', 'Summary must not be empty.').trim().isLength({ min: 1 }),

    // Sanitize fields.
    sanitizeBody('no').escape(),
    sanitizeBody('title').escape(),
    //sanitizeBody('author').escape(),
    sanitizeBody('review_star').escape(),
    sanitizeBody('review_summary').escape(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        var book = new Book(
          { no: req.body.no,
            title: req.body.title,
            author: req.body.author,
            status: req.body.status,
            review_star: req.body.review_star,
            review_summary: req.body.review_summary,
            review_date: req.body.review_date, 
            _id:req.params.id //This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Book.findByIdAndUpdate(req.params.id, book, {}, function (err,thebook) {
                if (err) { return next(err); }
                   // Successful - redirect to book detail page.
                   res.redirect(thebook.url);
                });
        }
    }
];
