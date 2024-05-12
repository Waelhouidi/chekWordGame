  const hangmanImg = document.getElementById('hangmanImg');
  const wordlImg = document.getElementById('wordlImg');

  function goToGame(url) {
    window.location.href = url;
  }

  hangmanImg.addEventListener('click', function() {
    goToGame('../hangman/hangman.html');
  });

  wordlImg.addEventListener('click', function() {
    goToGame('../gessArea/gess.html');
  });

