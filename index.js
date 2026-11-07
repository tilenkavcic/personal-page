document.addEventListener("DOMContentLoaded", function () {
  const bgGradient = document.querySelector(".bgGradient");
  const mainTextContainer = document.querySelector(".mainTextContainer");
  const mainTextEnding = document.querySelector(".mainTextEnding");
  const header = document.querySelector(".header");
  const linksContainer = document.querySelector(".linksContainer");
  const scrollAnim = document.querySelector(".scrollContainer");
  const inactiveWrapper = document.querySelector(".inactiveWrapper");
  const inactiveTrigger = document.querySelector(".inactiveTrigger");

  if (inactiveTrigger && inactiveWrapper) {
    inactiveTrigger.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = inactiveWrapper.classList.toggle("is-open");
      inactiveTrigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", function (e) {
      if (!inactiveWrapper.contains(e.target)) {
        inactiveWrapper.classList.remove("is-open");
        inactiveTrigger.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        inactiveWrapper.classList.remove("is-open");
        inactiveTrigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (!mainTextContainer) return;

  function getMinTranslateX() {
    return window.innerWidth <= 767 ? 100 : 90;
  }

  function getMaxScroll() {
    return Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  }

  // Smooth symmetrical S-curve: zero velocity at boundaries, uniform feel in both directions
  function smoothstep(t) {
    const clamped = Math.max(0, Math.min(1, t));
    return clamped * clamped * (3 - 2 * clamped);
  }

  let maxScroll = getMaxScroll();

  function getScrollProgress() {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    return Math.min(Math.max(scrollY / maxScroll, 0), 1);
  }

  let targetProgress = getScrollProgress();
  let currentProgress = targetProgress;
  let animId = null;
  let lastTime = performance.now();

  let resizeTimeout;
  window.addEventListener(
    "resize",
    function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        maxScroll = getMaxScroll();
        targetProgress = getScrollProgress();
        currentProgress = targetProgress;
        render(currentProgress);
      }, 100);
    },
    { passive: true }
  );

  function render(progress) {
    // Animate background gradient
    if (bgGradient) {
      const turn = progress * 0.05;
      bgGradient.style.setProperty("--bg-turn", `${turn}turn`);
    }

    // Slide main text: progress 0 to 0.55 maps to translateX 0 to -minTranslateX
    // Symmetrical smoothstep ensures running left and running right have identical smooth physics
    const minTranslateX = getMinTranslateX();
    const rawSlide = Math.min(progress / 0.55, 1);
    const easedSlide = smoothstep(rawSlide);
    const translateX = -(easedSlide * minTranslateX);
    mainTextContainer.style.transform = `translate3d(${translateX}%, 0, 0)`;

    // Scroll indicator fades out quickly once scrolling starts
    if (scrollAnim) {
      scrollAnim.classList.toggle("hidden", progress > 0.04);
    }

    // Reveal email ending smoothly as text settles into place
    if (mainTextEnding) {
      mainTextEnding.classList.toggle("visible", progress >= 0.48);
    }

    // Reveal header and links towards bottom
    const showLinks = progress >= 0.75;
    if (header) {
      header.classList.toggle("visible", showLinks);
    }
    if (linksContainer) {
      linksContainer.classList.toggle("visible", showLinks);
      if (!showLinks && inactiveWrapper) {
        inactiveWrapper.classList.remove("is-open");
        if (inactiveTrigger) {
          inactiveTrigger.setAttribute("aria-expanded", "false");
        }
      }
    }
  }

  function tick(now) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      currentProgress = targetProgress;
      render(currentProgress);
      animId = null;
      return;
    }

    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    const diff = targetProgress - currentProgress;
    if (Math.abs(diff) < 0.0001) {
      currentProgress = targetProgress;
      render(currentProgress);
      animId = null;
    } else {
      // Natural inertial damping: smooths mouse-wheel steps into a continuous fluid glide in both directions
      const factor = 1 - Math.exp(-8.5 * dt);
      currentProgress += diff * factor;
      render(currentProgress);
      animId = requestAnimationFrame(tick);
    }
  }

  function onScroll() {
    targetProgress = getScrollProgress();
    if (!animId) {
      lastTime = performance.now();
      animId = requestAnimationFrame(tick);
    }
  }

  const mainText = document.querySelector(".mainText");
  if (mainText) {
    mainText.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        window.copyDivToClipboard(e);
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  render(currentProgress);
});

let copyTimeout;

async function copyTextToClipboard(text) {
  let success = false;
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      success = true;
    } catch (e) {
      success = false;
    }
  }

  if (!success) {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.top = "-9999px";
      textArea.style.left = "-9999px";
      textArea.style.opacity = "0";
      textArea.setAttribute("readonly", "");
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, textArea.value.length);
      success = document.execCommand("copy");
      document.body.removeChild(textArea);
    } catch (err) {
      console.error("Fallback clipboard copy failed: ", err);
    }
  }

  return success;
}

window.copyDivToClipboard = async function (event) {
  if (event && typeof event.stopPropagation === "function") {
    event.stopPropagation();
  }

  const emailCopiedAlert = document.querySelector(".emailCopiedAlert");
  const mainText = document.querySelector(".mainText");

  try {
    await copyTextToClipboard("hey@tilenkavcic.com");

    if (!emailCopiedAlert || !mainText) return;

    const windowWidth = window.innerWidth;
    const isMobile = windowWidth <= 767;

    const divWidth = emailCopiedAlert.offsetWidth || 230;
    const divHeight = emailCopiedAlert.offsetHeight || 50;

    let divLeft;
    if (isMobile || !event || typeof event.clientX !== "number" || event.clientX === 0) {
      divLeft = Math.max(Math.round((windowWidth - divWidth) / 2), 12);
    } else {
      divLeft = event.clientX - divWidth / 2;
      divLeft = Math.max(divLeft, 12);
      divLeft = Math.min(divLeft, windowWidth - divWidth - 12);
    }

    const textRect = mainText.getBoundingClientRect();
    const divTop = Math.max(textRect.top - divHeight - 14, 12);

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
