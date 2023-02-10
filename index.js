document.addEventListener("DOMContentLoaded", function () {
  const mainTextContainer = document.querySelector(".mainTextContainer");
  const mainText = document.querySelector(".mainText");
  const mainTextEnding = document.querySelector(".mainTextEnding");
  const header = document.querySelector(".header");
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

      console.log(progress);


      if (progress >= scrollAnimTransition) {
        scrollAnim.style.opacity = "0";
      } else {
        scrollAnim.style.opacity = "100";
      }

      if (progress >= emailTransition) {
        mainTextEnding.style.color = "#fff";
      } else {
        mainTextEnding.style.color = "#000";
      }

      if (progress >= linksTransition) {
        header.style.opacity = "100";
      } else {
        header.style.opacity = "0";
      }

      mainTextContainer.style.transform = `translateX(${translateX}%)`;
    });
  }
});
