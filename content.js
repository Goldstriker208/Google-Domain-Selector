(function () {
  // Run once per page and inject only one dropdown
  let hasInserted = false;

  const observer = new MutationObserver(() => insertDropdown());
  observer.observe(document.body, { childList: true, subtree: true });

  function insertDropdown() {
    if (hasInserted) return;

    const header = document.querySelector("h1");
    if (!header || document.querySelector("#domain-selector")) return;

    chrome.storage.local.get(["domains"], result => {
      const domains = result.domains || [];
      if (domains.length === 0) return;

      // Avoid duplicate dropdowns
      if (document.querySelector("#domain-selector")) return;

      const label = document.createElement("label");
      label.textContent = "Select your domain:";
      label.style.display = "block";
      label.style.marginTop = "1em";

      const select = document.createElement("select");
      select.id = "domain-selector";
      select.style.marginTop = "0.5em";
      select.style.fontSize = "14px";

      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "-- Select your domain --";
      placeholder.disabled = true;
      placeholder.selected = true;
      select.appendChild(placeholder);

      domains.forEach(domain => {
        const option = document.createElement("option");
        option.value = domain;
        option.textContent = `@${domain}`;
        select.appendChild(option);
      });

      select.addEventListener("change", () => {
        if (select.value) {
          const url = `https://accounts.google.com/signin/v2/identifier?hd=${select.value}`;
          window.location.href = url;
        }
      });

      header.parentElement.insertBefore(label, header.nextSibling);
      header.parentElement.insertBefore(select, label.nextSibling);

      hasInserted = true;
    });
  }

  // Initial attempt
  insertDropdown();
})();
