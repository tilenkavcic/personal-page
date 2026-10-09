document.addEventListener("DOMContentLoaded", function () {
  const bgGradient = document.querySelector(".bgGradient");
  const mainTextContainer = document.querySelector(".mainTextContainer");
  const mainTextEnding = document.querySelector(".mainTextEnding");
  const header = document.querySelector(".header");
  const linksContainer = document.querySelector(".linksContainer");
  const scrollAnim = document.querySelector(".scrollContainer");

  if (!mainTextContainer) return;

  const minTranslateX = 90;

  function getMaxScroll() {
    return Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  }

  let maxScroll = getMaxScroll();

  let resizeTimeout;
  window.addEventListener(
    "resize",
    function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        maxScroll = getMaxScroll();
        update();
      }, 100);
    },
    { passive: true }
  );

  let isTicking = false;

  function update() {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

    // Animate background gradient
    if (bgGradient) {
      const turn = progress * 0.05;
      bgGradient.style.setProperty("--bg-turn", `${turn}turn`);
    }

    // Slide main text: progress 0 to 0.5 maps to translateX 0 to -minTranslateX
    const slideProgress = Math.min(progress / 0.5, 1);
    const translateX = -(slideProgress * minTranslateX);
    mainTextContainer.style.transform = `translate3d(${translateX}%, 0, 0)`;

    // Scroll indicator fades out quickly once scrolling starts
    if (scrollAnim) {
      scrollAnim.classList.toggle("hidden", progress > 0.05);
    }

    // Reveal email ending after text has slid into view
    if (mainTextEnding) {
      mainTextEnding.classList.toggle("visible", progress >= 0.5);
    }

    // Reveal header and links towards bottom
    const showLinks = progress >= 0.75;
    if (header) {
      header.classList.toggle("visible", showLinks);
    }
    if (linksContainer) {
      linksContainer.classList.toggle("visible", showLinks);
    }
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!isTicking) {
        window.requestAnimationFrame(function () {
          update();
          isTicking = false;
        });
        isTicking = true;
      }
    },
    { passive: true }
  );

  update();
});

let copyTimeout;

window.copyDivToClipboard = async function (event) {
  const emailCopiedAlert = document.querySelector(".emailCopiedAlert");
  const mainText = document.querySelector(".mainText");

  try {
    await navigator.clipboard.writeText("hey@tilenkavcic.com");

    if (!emailCopiedAlert || !mainText) return;

    const divWidth = emailCopiedAlert.offsetWidth;
    const windowWidth = window.innerWidth;
    let divLeft = event.clientX - divWidth / 2;
    divLeft = Math.max(divLeft, 12);
    divLeft = Math.min(divLeft, windowWidth - divWidth - 12);

    const textRect = mainText.getBoundingClientRect();
    const divHeight = emailCopiedAlert.offsetHeight;
    const divTop = Math.max(textRect.top - divHeight - 12, 12);

    emailCopiedAlert.style.left = `${divLeft}px`;
    emailCopiedAlert.style.top = `${divTop}px`;
    emailCopiedAlert.classList.add("visible");

    if (copyTimeout) {
      clearTimeout(copyTimeout);
    }

    copyTimeout = setTimeout(() => {
      emailCopiedAlert.classList.remove("visible");
    }, 2500);
  } catch (err) {
    console.error("Failed to copy to clipboard: ", err);
  }
};
