const domainList = document.getElementById("domainList");
const addBtn = document.getElementById("addBtn");
const removeBtn = document.getElementById("removeBtn");
const newDomain = document.getElementById("newDomain");

function refreshList(domains) {
  domainList.innerHTML = "";
  domains.forEach(domain => {
    const option = document.createElement("option");
    option.value = domain;
    option.textContent = domain;
    domainList.appendChild(option);
  });
}

function loadDomains() {
  chrome.storage.local.get(["domains"], result => {
    const domains = result.domains || [];
    refreshList(domains);
  });
}

addBtn.onclick = () => {
  const domain = newDomain.value.trim().replace(/^@/, "");
  if (!domain) return;
  chrome.storage.local.get(["domains"], result => {
    const domains = result.domains || [];
    if (!domains.includes(domain)) {
      domains.push(domain);
      chrome.storage.local.set({ domains }, loadDomains);
      newDomain.value = "";
    }
  });
};

removeBtn.onclick = () => {
  const selected = domainList.value;
  if (!selected) return;
  chrome.storage.local.get(["domains"], result => {
    const domains = (result.domains || []).filter(d => d !== selected);
    chrome.storage.local.set({ domains }, loadDomains);
  });
};

loadDomains();
