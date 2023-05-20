document.addEventListener('DOMContentLoaded', function reloadOnce() {
    setTimeout(function() {
      console.log('Success');
      window.location.href = "/matchmaking";
    }, 3500);
  
    document.removeEventListener('DOMContentLoaded', reloadOnce);
  });