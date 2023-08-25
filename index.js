document.addEventListener("DOMContentLoaded", function () {
  const mainHtml = document.querySelector("html");
  const mainTextContainer = document.querySelector(".mainTextContainer");
  const mainText = document.querySelector(".mainText");
  const mainTextEnding = document.querySelector(".mainTextEnding");
  const header = document.querySelector(".header");
  const linksContainer = document.querySelector(".linksContainer");
  const scrollAnim = document.querySelector(".scrollContainer");

  if (mainTextContainer) {
    const viewportHeight = window.innerHeight;
    const contentHeight = document.body.offsetHeight;
    const minTranslateX = 90;

    const scrollAnimTransition = 5;
    const emailTransition = minTranslateX + 40;
    const linksTransition = minTranslateX + 80;

    window.addEventListener("scroll", function () {
      let scrollY = window.scrollY;
      let progress = scrollY / (contentHeight - viewportHeight);

      // Animate background gradient
      mainHtml.style.background = `conic-gradient(from ${progress/20}turn at 0% 0%, #00c476, 20%, #82b0ff, 90%, #00c476)`;
      mainHtml.style.backgroundAttachment = `fixed`;
      console.log(progress/9)
      // Adjust progress value for transitions
      progress *= 80;
      translateX = progress;
      translateX = -Math.min(translateX, minTranslateX);

      // Specify fade in on scroll transitions
      scrollAnim.style.opacity = progress >= scrollAnimTransition ? "0" : "100";
      mainTextEnding.style.color = progress >= emailTransition ? "inherit" : "#00000000"
      header.style.opacity = progress >= linksTransition ? "100" : "0"
      linksContainer.style.opacity = progress >= linksTransition ? "100" : "0"

      mainTextContainer.style.transform = `translateX(${translateX}%)`;
    });
  }
});
