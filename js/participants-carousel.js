const track = document.querySelector('.participants__track')
const items = document.querySelectorAll('.participants__item')

const navButtonPrev = document.querySelector('.participants__nav-button--prev')
const navButtonNext = document.querySelector('.participants__nav-button--next')
const navCurrent = document.querySelector('.participants__nav-content-current')
const navTotal = document.querySelector('.participants__nav-content-total');

const TOTAL = items.length
const VISIBLE = 3

let currentIndex = 0
let slideWidth = items[0].offsetWidth + 20

const goTo = index => {
    track.style.transform = `translateX(-${index * slideWidth}px)`
    currentIndex = index
    navCurrent.textContent = (VISIBLE + currentIndex).toString()
}

const recountSlideWidth = () => {
    slideWidth = items[0].offsetWidth + 20
}

const init = () => {
    navTotal.textContent = TOTAL.toString()
    goTo(0)
}

navButtonPrev.addEventListener('click', () => {
    if (currentIndex > 0) goTo(currentIndex - 1)
})

navButtonNext.addEventListener('click', () => {
    if (currentIndex < TOTAL - VISIBLE) goTo(currentIndex + 1)
})

window.addEventListener('resize', () => {
    recountSlideWidth()
    goTo(currentIndex)
})

init()
