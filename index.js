document.addEventListener("DOMContentLoaded", function () {
  const mainTextContainer = document.querySelector(".mainTextContainer");
  const mainText = document.querySelector(".mainText");
  const mainTextEnding = document.querySelector(".mainTextEnding");

  if (mainTextContainer) {
    const viewportHeight = window.innerHeight;
    const contentHeight = document.body.offsetHeight;
    const minTranslateX = 90;
    let transitionPoint = false;

    window.addEventListener("scroll", function () {
      let scrollY = window.scrollY;
      let progress = -scrollY / (contentHeight - viewportHeight);
      translateX = -Math.min(progress*2, minTranslateX);

      if (progress >= minTranslateX + 30) {
        mainTextEnding.style.color = "#fff";
      } else {
        mainTextEnding.style.color = "#000";
      }

      mainTextContainer.style.transform = `translateX(${translateX}%)`;
    });
  }
});
