// capture the form submission
async function commentFormHandler(event) {
    event.preventDefault();
  
    // we need to declare two variables when the form is submitted: the post id from the URL and the value of the <textarea> element
    const comment_text = document.querySelector('textarea[name="comment-body"]').value.trim();
  
    const post_id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
  
    // wrapped request in an if statement to prevent users from submitting empty strings
    if (comment_text) {
        // defined method as POST and included two properties on the body
        const response = await fetch('/api/comments', {
          method: 'POST',
          body: JSON.stringify({
            post_id,
            comment_text
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      
        if (response.ok) {
          document.location.reload();
        } else {
          alert(response.statusText);
        }
      }
  }
  
  document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);