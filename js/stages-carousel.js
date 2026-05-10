const stagesItems = document.querySelector('.stages__items')
const stagesSlides = document.querySelectorAll('.stages__slide')
const stagesPrev = document.querySelector('.stages__nav-button--prev')
const stagesNext = document.querySelector('.stages__nav-button--next')
const stagesDots = document.querySelectorAll('.stages__nav-dot')

const STAGES_TOTAL = stagesSlides.length
let stagesIndex = 0

const stagesUpdate = () => {
    stagesItems.style.transform = `translateX(-${stagesIndex * 100}%)`
    stagesPrev.disabled = stagesIndex === 0
    stagesNext.disabled = stagesIndex === STAGES_TOTAL - 1
    stagesDots.forEach((dot, i) => {
        dot.classList.toggle('stages__nav-dot--active', i === stagesIndex)
    })
}

stagesPrev.addEventListener('click', () => {
    if (stagesIndex > 0) {
        stagesIndex--
        stagesUpdate()
    }
})

stagesNext.addEventListener('click', () => {
    if (stagesIndex < STAGES_TOTAL - 1) {
        stagesIndex++
        stagesUpdate()
    }
})

stagesUpdate()

const mobileQuery = window.matchMedia('(max-width: 768px)')

mobileQuery.addEventListener('change', (e) => {
    if (!e.matches) {
        stagesIndex = 0
        stagesUpdate()
    }
})
