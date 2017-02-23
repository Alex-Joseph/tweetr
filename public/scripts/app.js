
//Client-side JS logic goes here

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
                  <div id="footer-buttons">
                    <a><i class="fa fa-flag" aria-hidden="true"></i></a>
                    <a><i class="fa fa-retweet" aria-hidden="true"></i></a>
                    <a><i class="fa fa-heart" aria-hidden="true"></i></a>
                  </div>
                </footer>
              </article>`;
  return html;
}

function loadTweets () {
  $.ajax({
    method: 'GET',
    url: "/tweets",
    success: (data) => {
      $('.tweet-container').empty();
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
    $( ".new-tweet" ).slideToggle( "fast" );
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
