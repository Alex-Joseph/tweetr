/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
//const $tweet = $("<article>")addClass("tweet");
// Test / driver code (temporary). Eventually will get this from the server.
let data = [
  {
    "user": {
      "name": "Newton",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461113796368
  }
];
// ----------------------------------------------------------------------
function renderTweets(tweets) {
  let sortedTweets = tweets.sort( (a, b) => {
    return b.created_at - a.created_at;
  }); //nees to sort by date!!!
  let tweetString = ``;
  tweets.map( (tweet) => {
    tweetString += createTweetElement(tweet);
  })
  return tweetString;
}

function timeDifference(current, previous) {
  let msPerMinute = 60 * 1000;
  let msPerHour = msPerMinute * 60;
  let msPerDay = msPerHour * 24;
  let msPerMonth = msPerDay * 30;
  let msPerYear = msPerDay * 365;
  let elapsed = current - previous;
  if (elapsed < msPerMinute) {
      return Math.round(elapsed/1000) + ' seconds ago';
  }
  else if (elapsed < msPerHour) {
      return Math.round(elapsed/msPerMinute) + ' minutes ago';
  }
  else if (elapsed < msPerDay ) {
      return Math.round(elapsed/msPerHour ) + ' hours ago';
  }
  else if (elapsed < msPerMonth) {
     return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';
  }
  else if (elapsed < msPerYear) {
     return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';
  }
  else {
     return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';
  }
}

function createTweetElement(tweet) {
  let userName = tweet.user.name;
  let photo = tweet.user.avatars.small;
  let userHandle = tweet.user.handle;
  let tweetText = tweet.content.text;
  let timeStamp = timeDifference(Date.now(), tweet.created_at)
  let html = `<article class="sent-tweets">
                <header>
                  <img src=${photo}><h2>${userName}</h2><h5>${userHandle}</h5>
                </header>
                <div class="tweet-body">
                  ${tweetText}
                </div>
                <footer>
                  ${timeStamp}
                </footer>
              </article>`;
  return html;
}

function loadTweets () {
  $.ajax({
    method: 'GET',
    url: "/tweets",
    success: (data) => {
      $('.tweet-container').prepend(renderTweets(data));
    }
  })
};
function printTweet () {
  $.ajax({
    method: 'GET',
    url: "/tweets",
    success: (data) => {
      $('.tweet-container').prepend(renderTweets([data[data.length-1]]));
    }
  })
};
$(document).ready( () => {

  loadTweets();

  $( "#compose-button" ).click( () => {
    $( ".new-tweet" ).slideToggle( 600 );
    $("#tweet").focus();
  });

  $('#tweetForm').on('submit', (ev) => {
    ev.preventDefault();
    let newTweet = $('#tweetForm').serialize();
    let tweetLen = $("#tweet").val().length;
    if (tweetLen === 0) {
      return alert("No tweet submitted!");
    }
    if (tweetLen > 140) {
      return alert("Sorry your tweet is too long!");
    }

    $.ajax({
      method: 'POST',
      url: `/tweets`,
      data: newTweet
    })
    .done((response) => {
      printTweet()
      console.log('new post created!', response);
      $('#tweet').val("");
      $("#charCounter").text("140");
      $("#charCounter").removeClass(".red-text");
    })
    .fail(console.error);
  });
});
