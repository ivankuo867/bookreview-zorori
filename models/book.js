var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var BookSchema = new Schema(
  {
    no: {type: Number, required: true, default:0},
    title: {type: String, required: true, default:'NA'},
    //img_cover:{String}
    author: {type: String, required: true, default:'原裕'},      
    status: {type: String, required: true, enum: ['還沒看過', '看過:圖書館','看過:收藏中'], default: '還沒看過'},
    review_star: {type:Number, min: 1, max: 5},
    review_summary: {type: String },
    review_date:{ type: Date, default: Date.now }
    //genre: [{type: Schema.Types.ObjectId, ref: 'Genre'}]
  }
);

// Virtual for book's URL
BookSchema
.virtual('url')
.get(function () {
  return '/catalog/book/' + this._id;
});

BookSchema
.virtual('review_date_formatted')
.get(function(){
  return moment(this.review_date).format('YYYY/MM/DD');
});

//Export model
module.exports = mongoose.model('Book', BookSchema);
