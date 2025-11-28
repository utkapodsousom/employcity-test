const initUi = () => {
  document.querySelectorAll("[data-slider]").forEach((slider) => {
    const range = slider.querySelector(".slider__range");
    const valueEl = slider.querySelector("[data-slider-value]");

    if (!range || !valueEl) return;

    const update = () => {
      valueEl.textContent = range.value;
    };

    range.addEventListener("input", update);
    update();
  });

  document.querySelectorAll("[data-custom-select]").forEach((select) => {
    const trigger = select.querySelector("[data-select-trigger]");
    const valueEl = select.querySelector("[data-select-value]");
    const menu = select.querySelector("[data-select-menu]");
    const native = select.querySelector(".custom-select__native");
    const options = Array.from(select.querySelectorAll("[data-select-option]"));

    if (!trigger || !valueEl || !menu || !options.length) return;

    const closeSelect = () => {
      select.classList.remove("custom-select--open");
      trigger.setAttribute("aria-expanded", "false");
    };

    const openSelect = () => {
      select.classList.add("custom-select--open");
      trigger.setAttribute("aria-expanded", "true");
    };

    const setValue = (option) => {
      options.forEach((item) =>
        item.classList.toggle(
          "custom-select__option--active",
          item === option
        )
      );
      valueEl.textContent = option.textContent.trim();

      if (native) {
        native.value = option.dataset.value || "";
        native.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };

    trigger.addEventListener("click", () => {
      const isOpen = select.classList.contains("custom-select--open");
      if (isOpen) {
        closeSelect();
      } else {
        openSelect();
      }
    });

    options.forEach((option) => {
      option.addEventListener("click", () => {
        setValue(option);
        closeSelect();
      });
    });

    document.addEventListener("click", (event) => {
      if (!select.contains(event.target)) {
        closeSelect();
      }
    });

    const initialValue = native ? native.value : "";
    const initialOption =
      (initialValue &&
        options.find((opt) => opt.dataset.value === initialValue)) ||
      options[0];

    if (initialOption) {
      setValue(initialOption);
    }
  });

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#main-nav");

  if (toggle && nav) {
    const closeNav = () => {
      nav.classList.remove("nav--open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("nav--open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (evt) => {
      if (!nav.contains(evt.target) && !toggle.contains(evt.target)) {
        closeNav();
      }
    });
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initUi);
} else {
  initUi();
}
