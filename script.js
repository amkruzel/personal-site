'use strict';

const navBar = document.querySelector('.nav');
const navItems = document.querySelectorAll('.nav-item');
const projectsSection = document.querySelector('.projects-section');
const modal = document.querySelector('.ttt-modal');
const overlay = document.querySelector('.overlay');
const projBtns = document.querySelectorAll('.projects-button');
const amtOfProjBtns = 4;

/////////////////////
//// Callback functions

const projectsSectionVisible = function () {
  projBtns.forEach(el => (el.style.visibility = 'visible'));
  for (let i = 1; i <= amtOfProjBtns; i++) {
    document.getElementById(`proj-btn-${i}`).style.opacity = 1;
  }
};

/////////////////////////////
///// TTT modal

window.addEventListener('load', function () {
  modal.classList.remove('hidden');
});

const closeModal = function () {
  modal.classList.add('modal-hidden');
  overlay.classList.add('modal-hidden');
};

////////////////////////
/// Nav bar events
// Hover

navBar.addEventListener('mouseover', function (e) {
  const item = e.target;

  navItems.forEach(e => (e.style.opacity = '.4'));
  item.style.opacity = '1';

  navBar.addEventListener('mouseout', function (e) {
    navItems.forEach(e => (e.style.opacity = '1'));
  });
});

// Click

navBar.addEventListener('click', function (e) {
  e.preventDefault();

  if (!e.target.classList.contains('nav-item')) return;
  const id = e.target.getAttribute('href');

  document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  projectsSectionVisible(e);
});
