const menuButton = document.getElementById("menu-button");
const navLinks = document.getElementById("nav-links");
const links = document.querySelectorAll(".nav-links a");


// Open and close mobile menu

menuButton.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});


// Close menu when a navigation link is clicked

links.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
  });
});