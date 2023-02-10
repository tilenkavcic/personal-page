document.addEventListener("DOMContentLoaded", function () {
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

    const scrollAnimTransition = 40;
    const emailTransition = minTranslateX + 40;
    const linksTransition = minTranslateX + 80;

    window.addEventListener("scroll", function () {
      let scrollY = window.scrollY;
      let progress = scrollY / (contentHeight - viewportHeight);
      progress *= 20;
      translateX = progress;
      translateX = -Math.min(translateX, minTranslateX);

      scrollAnim.style.opacity = progress >= scrollAnimTransition ? "0" : "100";
      mainTextEnding.style.color = progress >= emailTransition ? "#fff" : "#000"
      header.style.opacity = progress >= linksTransition ? "100" : "0"
      linksContainer.style.opacity = progress >= linksTransition ? "100" : "0"

      mainTextContainer.style.transform = `translateX(${translateX}%)`;
    });
  }
});
