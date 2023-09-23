document.addEventListener('DOMContentLoaded', function reloadOnce() {


  
  
      console.log('Success');
// =================================================
setTimeout(() => {
  fetch('/dbSync', {
    method: 'POST',
  })
    .then(response => response.text())
    .then(result => {
      console.log(result);
      // Redirect after the database fetching is completed
      window.location.href = "/matchmaking";
    })
    .catch(error => {
      console.error('Error:', error);
    });
}, 3500);
// =================================================
  
    

  
    document.removeEventListener('DOMContentLoaded', reloadOnce);
  });

