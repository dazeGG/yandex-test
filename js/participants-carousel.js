const participantsTrack = document.querySelector('.participants__track')
const participantsItems = document.querySelectorAll('.participants__item')

const participantsPrev = document.querySelector('.participants__nav-button--prev')
const participantsNext = document.querySelector('.participants__nav-button--next')
const participantsCurrent = document.querySelector('.participants__nav-content-current')
const participantsTotal = document.querySelector('.participants__nav-content-total')

const PARTICIPANTS_TOTAL = participantsItems.length

const getVisible = () => window.matchMedia('(max-width: 768px)').matches ? 1 : 3

let VISIBLE = getVisible()
let CLONED_TOTAL = PARTICIPANTS_TOTAL + VISIBLE * 2

let participantsIndex = VISIBLE
let slideWidth = participantsItems[0].offsetWidth + 20
let autoplayInterval = null
let isTransitioning = false

const getLogicalIndex = () => ((participantsIndex - VISIBLE) % PARTICIPANTS_TOTAL + PARTICIPANTS_TOTAL) % PARTICIPANTS_TOTAL

const updateCounter = () => {
    participantsCurrent.textContent = ((getLogicalIndex() + VISIBLE - 1) % PARTICIPANTS_TOTAL + 1).toString()
}

const goTo = (index, animated = true) => {
    participantsIndex = index
    participantsTrack.style.transition = animated ? 'transform var(--carousel-transition)' : 'none'
    participantsTrack.style.transform = `translateX(-${participantsIndex * slideWidth}px)`
    updateCounter()
}

participantsTrack.addEventListener('transitionend', () => {
    // Если ушли в клоны слева — прыгаем на оригиналы справа
    if (participantsIndex <= VISIBLE - 1) {
        participantsTrack.style.transition = 'none'
        participantsIndex += PARTICIPANTS_TOTAL
        participantsTrack.style.transform = `translateX(-${participantsIndex * slideWidth}px)`
        participantsTrack.offsetHeight
        updateCounter()
    }

    // Если ушли в клоны справа — прыгаем на оригиналы слева
    if (participantsIndex >= CLONED_TOTAL - VISIBLE) {
        participantsTrack.style.transition = 'none'
        participantsIndex -= PARTICIPANTS_TOTAL
        participantsTrack.style.transform = `translateX(-${participantsIndex * slideWidth}px)`
        participantsTrack.offsetHeight
        updateCounter()
    }

    isTransitioning = false
})

const goPrev = () => {
    if (isTransitioning) return
    isTransitioning = true
    goTo(participantsIndex - 1)
}

const goNext = () => {
    if (isTransitioning) return
    isTransitioning = true
    goTo(participantsIndex + 1)
}

const recountSlideWidth = () => {
    slideWidth = participantsItems[0].offsetWidth + 20
}

const setupClones = () => {
    const originals = new Set(participantsItems)
    const allChildren = [...participantsTrack.children]

    allChildren.forEach(child => {
        if (!originals.has(child)) child.remove()
    })

    const firstItems = [...participantsItems].slice(0, VISIBLE)
    const lastItems = [...participantsItems].slice(PARTICIPANTS_TOTAL - VISIBLE)

    lastItems.forEach(item => participantsTrack.insertBefore(item.cloneNode(true), participantsTrack.firstChild))
    firstItems.forEach(item => participantsTrack.appendChild(item.cloneNode(true)))
}

const init = () => {
    setupClones()
    participantsTotal.textContent = PARTICIPANTS_TOTAL.toString()
    goTo(participantsIndex, false)
    autoplayInterval = setInterval(goNext, 4000)
}

participantsPrev.addEventListener('click', () => {
    goPrev()
    clearInterval(autoplayInterval)
})

participantsNext.addEventListener('click', () => {
    goNext()
    clearInterval(autoplayInterval)
})

window.addEventListener('resize', () => {
    const newVisible = getVisible()

    if (newVisible !== VISIBLE) {
        const logicalIndex = getLogicalIndex()
        VISIBLE = newVisible
        CLONED_TOTAL = PARTICIPANTS_TOTAL + VISIBLE * 2
        setupClones()
        participantsIndex = VISIBLE + logicalIndex
    }

    recountSlideWidth()
    goTo(participantsIndex, false)
})

init()
