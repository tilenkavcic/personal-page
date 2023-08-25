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
      mainHtml.style.background = `conic-gradient(from ${
        progress / 20
      }turn at 0% 0%, #00c476, 20%, #82b0ff, 90%, #00c476)`;
      mainHtml.style.backgroundAttachment = `fixed`;
      // Adjust progress value for transitions
      progress *= 80;
      translateX = progress;
      translateX = -Math.min(translateX, minTranslateX);

      // Specify fade in on scroll transitions
      scrollAnim.style.opacity = progress >= scrollAnimTransition ? "0" : "100";
      mainTextEnding.style.color = progress >= emailTransition ? "inherit" : "#00000000";
      header.style.opacity = progress >= linksTransition ? "100" : "0";
      linksContainer.style.opacity = progress >= linksTransition ? "100" : "0";

      mainTextContainer.style.transform = `translateX(${translateX}%)`;
    });
  }
});

const copyDivToClipboard = async (event) => {
  const emailCopiedAlert = document.querySelector(".emailCopiedAlert");
  const mainText = document.querySelector(".mainText");

  try {
    await navigator.clipboard.writeText("hey@tilenkavcic.com");

    if (emailCopiedAlert.style.opacity != 0) return;

    // Move alert to cursor
    // prevent alert to be off screen
    let divWidth = emailCopiedAlert.offsetWidth;
    let divLeft = event.clientX - divWidth / 2;
    divLeft = Math.max(divLeft, 8); 

    let screenWidth = screen.width

    divLeft = Math.min(divLeft, screenWidth - divWidth-10)
    emailCopiedAlert.style.left = `${divLeft}px`;

    console.log()

    let textTopPostiton = mainText.getBoundingClientRect().top;
    let divHeight = emailCopiedAlert.offsetHeight;
    emailCopiedAlert.style.top = `${textTopPostiton - divHeight - 10}px`;

    // Show alert
    emailCopiedAlert.style.animation = `bounce2 1.5s ease`;

    emailCopiedAlert.style.opacity = 1;

    // Fade out alert
    setTimeout(() => {
      emailCopiedAlert.style.opacity = 0;
      emailCopiedAlert.style.animation = ``;
    }, 3000);
  } catch (err) {
    console.error("Failed to copy to clipborard: ", err);
  }
};
