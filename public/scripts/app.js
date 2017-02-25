
//Client-side JS logic goes here

function renderTweets(tweets) {
  let sortedTweets = tweets.sort( (a, b) => {
    return b.created_at - a.created_at;
  });
  let tweetString = ``;
  sortedTweets.map( (tweet) => {
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
  } else if (elapsed < msPerHour) {
      return Math.round(elapsed/msPerMinute) + ' minutes ago';
  } else if (elapsed < msPerDay ) {
      return Math.round(elapsed/msPerHour ) + ' hours ago';
  } else if (elapsed < msPerMonth) {
     return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';
  } else if (elapsed < msPerYear) {
     return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';
  } else {
     return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';
  }
}

function createTweetElement(tweet) {
  let userName = tweet.user.name;
  let photo = tweet.user.avatars.small;
  let userHandle = tweet.user.handle;
  let tweetText = tweet.content.text;
  let timeStamp = timeDifference(Date.now(), tweet.created_at);
  let likes = tweet.likes ? tweet.likes : "";
  let tweetId = tweet._id;
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
                    <a class="likes-button" data-tweetId="${tweetId}" data-likes="${likes}" data-likeStatus="false">
                      <i class="fa fa-heart" aria-hidden="true">${likes}</i>
                    </a>
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

      $( ".likes-button" ).click(function(ev) {
        // ev.stopPropagation();
        // ev.preventDefault();
        let likeStatus = $(ev.target).closest('a').data("likestatus");
        let likes = $(ev.target).closest('a').val()
        let tweetId = $(ev.target).closest('a').data("tweetid");
          if ( !likeStatus ) {
            $.ajax({
              method: 'POST',
              url: `/likes`,
              data: { tweetId: tweetId},
              success: loadTweets()
            })
            .done((response) => {
            })
            .fail(console.error);
        }
      })
    }
  })
}
/* The like button: *** new tweets have likes value
1. add like: <value> to the DB for each item...done
2. logic to display num of likes if > 0
3. Need to toggle like button (like/unlike) along with color change
4. ajax get request to get num of likes
5. ajax post to update like count

*/

$(document).ready( () => {

  loadTweets();

  $( "#compose-button" ).click( () => {
    $("#tweet").empty();
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
      loadTweets()
      console.log('new post created!', response);
      $('#tweet').val("");
      $("#charCounter").text("140");
      $("#charCounter").removeClass(".red-text");
    })
    .fail(console.error);
  });
});
