const track = document.querySelector('.participants__track')
const items = document.querySelectorAll('.participants__item')

const navButtonPrev = document.querySelector('.participants__nav-button--prev')
const navButtonNext = document.querySelector('.participants__nav-button--next')
const navCurrent = document.querySelector('.participants__nav-content-current')
const navTotal = document.querySelector('.participants__nav-content-total')

const TOTAL = items.length
const VISIBLE = 3
const CLONED_TOTAL = TOTAL + VISIBLE * 2

let currentIndex = VISIBLE
let slideWidth = items[0].offsetWidth + 20
let autoplayInterval = null
let isTransitioning = false

const goTo = (index, animated = true) => {
    currentIndex = index
    track.style.transition = animated ? 'transform var(--transition)' : 'none'
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`
    navCurrent.textContent = (((currentIndex - 1 + TOTAL) % TOTAL) + 1).toString()
}

track.addEventListener('transitionend', () => {
    // Если ушли в клоны слева — прыгаем на оригиналы справа
    if (currentIndex <= VISIBLE - 1) {
        track.style.transition = 'none'
        currentIndex += TOTAL
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`
        track.offsetHeight
        navCurrent.textContent = (((currentIndex - 1 + TOTAL) % TOTAL) + 1).toString()
    }

    // Если ушли в клоны справа — прыгаем на оригиналы слева
    if (currentIndex >= CLONED_TOTAL - VISIBLE) {
        track.style.transition = 'none'
        currentIndex -= TOTAL
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`
        track.offsetHeight
        navCurrent.textContent = (((currentIndex - 1 + TOTAL) % TOTAL) + 1).toString()
    }

    isTransitioning = false
})

const goPrev = () => {
    if (isTransitioning) return
    isTransitioning = true
    goTo(currentIndex - 1)
}

const goNext = () => {
    if (isTransitioning) return
    isTransitioning = true
    goTo(currentIndex + 1)
}

const recountSlideWidth = () => {
    slideWidth = items[0].offsetWidth + 20
}

const init = () => {
    const firstItems = [...items].slice(0, VISIBLE)
    const lastItems = [...items].slice(TOTAL - VISIBLE)

    lastItems.forEach(item => track.insertBefore(item.cloneNode(true), track.firstChild))
    firstItems.forEach(item => track.appendChild(item.cloneNode(true)))

    navTotal.textContent = TOTAL.toString()
    goTo(currentIndex, false)
    autoplayInterval = setInterval(goNext, 4000)
}

navButtonPrev.addEventListener('click', () => {
    goPrev()
    clearInterval(autoplayInterval)
})

navButtonNext.addEventListener('click', () => {
    goNext()
    clearInterval(autoplayInterval)
})

window.addEventListener('resize', () => {
    recountSlideWidth()
    goTo(currentIndex, false)
})

init()
