(function () {
  var root = document.documentElement;

  function save(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  document.getElementById("lang-toggle").addEventListener("click", function () {
    var next = root.lang === "en" ? "pt-BR" : "en";
    root.lang = next;
    save("lang", next);
  });

  document.getElementById("theme-toggle").addEventListener("click", function () {
    var current = root.dataset.theme ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    save("theme", next);
  });
})();
