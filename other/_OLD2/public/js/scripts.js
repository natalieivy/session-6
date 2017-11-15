const panels = document.querySelectorAll('.panel')
const triggers = document.querySelectorAll('a')

function toggleOpen() {
  closePanels()
  this.classList.toggle('active')
}

function closePanels() {
  panels.forEach(panel => panel.classList.remove('active'))
}

panels.forEach(panel => panel.addEventListener('click', toggleOpen))


const highlight = document.createElement('span');
highlight.classList.add('highlight');
document.body.append(highlight);

function highlightLink() {
  const linkCoords = this.getBoundingClientRect();
  const coords = {
    width: linkCoords.width,
    height: linkCoords.height,
    top: linkCoords.top + window.scrollY,
    left: linkCoords.left + window.scrollX
  };

  highlight.style.width = `${coords.width}px`;
  highlight.style.height = `${coords.height}px`;
  highlight.style.transform = `translate(${coords.left}px, ${coords.top}px)`;
}

triggers.forEach(panel => panel.addEventListener('mouseenter', highlightLink));
panels.forEach(panel => panel.addEventListener('transitionend', highlightLink));




















