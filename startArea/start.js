  // Get references to the images
  const hangmanImg = document.getElementById('hangmanImg');
  const wordlImg = document.getElementById('wordlImg');

  // Function to open an external page when an image is clicked
  function openExternalPage(url) {
    window.open(url, '_blank'); // Open the URL in a new tab
  }

  // Add click event listeners to the images
  hangmanImg.addEventListener('click', function() {
    openExternalPage('../hangman/hangman.html');
  });

  wordlImg.addEventListener('click', function() {
    openExternalPage('../gessArea/gess.html')
  });