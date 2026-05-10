const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            revealObserver.unobserve(entry.target)
        }
    })
}, { threshold: 0.5 })

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el))
