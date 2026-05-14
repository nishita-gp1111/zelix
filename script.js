const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
}

document.querySelectorAll("[data-contact-form]").forEach((form) => {
  const message = form.querySelector("[data-form-message]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const endpoint = form.getAttribute("action");
    const isPlaceholder = !endpoint || endpoint.includes("YOUR_FORM_ID");

    try {
      if (!isPlaceholder) {
        const response = await fetch(endpoint, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error("form-submit-failed");
        }
      }

      form.reset();
      if (message) {
        message.textContent = "お問い合わせありがとうございます。";
        message.classList.add("is-visible");
      }
    } catch {
      if (message) {
        message.textContent = "送信できませんでした。お手数ですが、電話またはメールでお問い合わせください。";
        message.classList.add("is-visible");
      }
    }
  });
});
