const panels = document.querySelectorAll('.panel')
const triggers = document.querySelectorAll('a')

function toggleOpen(){
  closePanels()
  this.classList.toggle('active')
}

function closePanels(){
  panels.forEach( (panel) => panel.classList.remove('active'))
}

panels.forEach( (panel) => panel.addEventListener('click', toggleOpen))


