const track = document.querySelector('.participants__track')
const items = document.querySelectorAll('.participants__item')

const navButtonPrev = document.querySelector('.participants__nav-button--prev')
const navButtonNext = document.querySelector('.participants__nav-button--next')
const navCurrent = document.querySelector('.participants__nav-content-current')
const navTotal = document.querySelector('.participants__nav-content-total')

const TOTAL = items.length

const getVisible = () => window.matchMedia('(max-width: 768px)').matches ? 1 : 3

let VISIBLE = getVisible()
let CLONED_TOTAL = TOTAL + VISIBLE * 2

let currentIndex = VISIBLE
let slideWidth = items[0].offsetWidth + 20
let autoplayInterval = null
let isTransitioning = false

const getLogicalIndex = () => ((currentIndex - VISIBLE) % TOTAL + TOTAL) % TOTAL

const updateCounter = () => {
    navCurrent.textContent = ((getLogicalIndex() + VISIBLE - 1) % TOTAL + 1).toString()
}

const goTo = (index, animated = true) => {
    currentIndex = index
    track.style.transition = animated ? 'transform var(--transition)' : 'none'
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`
    updateCounter()
}

track.addEventListener('transitionend', () => {
    // Если ушли в клоны слева — прыгаем на оригиналы справа
    if (currentIndex <= VISIBLE - 1) {
        track.style.transition = 'none'
        currentIndex += TOTAL
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`
        track.offsetHeight
        updateCounter()
    }

    // Если ушли в клоны справа — прыгаем на оригиналы слева
    if (currentIndex >= CLONED_TOTAL - VISIBLE) {
        track.style.transition = 'none'
        currentIndex -= TOTAL
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`
        track.offsetHeight
        updateCounter()
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

const setupClones = () => {
    const originals = new Set(items)
    const allChildren = [...track.children]

    allChildren.forEach(child => {
        if (!originals.has(child)) child.remove()
    })

    const firstItems = [...items].slice(0, VISIBLE)
    const lastItems = [...items].slice(TOTAL - VISIBLE)

    lastItems.forEach(item => track.insertBefore(item.cloneNode(true), track.firstChild))
    firstItems.forEach(item => track.appendChild(item.cloneNode(true)))
}

const init = () => {
    setupClones()
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
    const newVisible = getVisible()

    if (newVisible !== VISIBLE) {
        const logicalIndex = getLogicalIndex()
        VISIBLE = newVisible
        CLONED_TOTAL = TOTAL + VISIBLE * 2
        setupClones()
        currentIndex = VISIBLE + logicalIndex
    }

    recountSlideWidth()
    goTo(currentIndex, false)
})

init()
