"use strict";
const ObjectId = require('mongodb').ObjectID;
// Simulates the kind of delay we see with network or filesystem operations
// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet, callback);
    },

    getTweets: function(callback) {
      db.collection("tweets").find({}).toArray((err, tweets) => {
        if (err) {
          return callback(err);
        }
        callback(null, tweets);
      });
    },

    updateLikes: function(tweetId, callback) {
      console.log("inside updateLikes");
      console.log(tweetId);
      db.collection("tweets").findOneAndUpdate({"_id": ObjectId(tweetId)}, {$inc: {"likes": 1 } })
    }
  };
};
