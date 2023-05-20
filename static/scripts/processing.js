document.addEventListener('DOMContentLoaded', function reloadOnce() {
    setTimeout(function() {
      console.log('Success');
      window.location.href = "/matchmaking/match";
    }, 1000);
  
    document.removeEventListener('DOMContentLoaded', reloadOnce);
  });
  