// Common variables
const slider = document.querySelector('.reviews_slider')
const slides = document.getElementsByClassName('slider_item') // (important) this selection is a live collection any changes in DOM is updated in the variable unlike querySelectors
const buttonLeft = document.querySelector('.button_left')
const buttonRight = document.querySelector('.button_right')
const sliderBullets = document.querySelector('.bullets')

let currentSlideNumber = 0
let lastSlideNumber = slides.length - 1

// Infinity slider (start)
// Create bullets
function createSliderBullets() {

    [...slides].forEach((s, i) => {

        if (i === 0) {
            sliderBullets.innerHTML += '<div id = "slider_bullet_id_' + s.getAttribute('data-slide-number') + '" class="bullet_item bullet_item_active"></div>'
        } else {
            sliderBullets.innerHTML += '<div id = "slider_bullet_id_' + s.getAttribute('data-slide-number') + '" class="bullet_item"></div>'
        }
    })
}
createSliderBullets()

// Change active bullet and counter value
function changeActiveSliderBullet(currentSlideNumber) {

    let allBullets = document.querySelectorAll('.bullet_item')

    allBullets.forEach(item => {
        item.classList.remove('bullet_item_active')
    })

    document.querySelector('#slider_bullet_id_' + currentSlideNumber).classList.add('bullet_item_active')
}

// Go to a slide
function goToSlide(slideNumber) {
    [...slides].forEach((s, i) => {

        if ((100 * (i - slideNumber)) === 0) {
            changeActiveSliderBullet(s.getAttribute('data-slide-number'))
        }

        s.style.transform = `translateX(${100 * (i - slideNumber)}%)`
    })
    currentSlideNumber = slideNumber
}
goToSlide(currentSlideNumber)

// Make ready the next slide if current slide is the first or the last slide
function readyNextSlide() {
    // If currentSlide is the last slide, shift the first slide to the end
    if (currentSlideNumber === lastSlideNumber) {
        slides[lastSlideNumber].insertAdjacentElement("afterend", slides[0])
        slides[lastSlideNumber].style.transform = `translateX(${100}%)`
        currentSlideNumber--
    }
    // If currentSlide is the first slide, shift the last slide to the beginning
    if (currentSlideNumber === 0) {
        slides[0].insertAdjacentElement("beforebegin", slides[lastSlideNumber])
        slides[0].style.transform = `translateX(-${100}%)`
        currentSlideNumber++
    }
}

// Put the last slide in the beginning
if (currentSlideNumber === lastSlideNumber || currentSlideNumber === 0) readyNextSlide()

// Shift all slides left or right based on direction provided
function shiftSlides(direction) {
    direction ? currentSlideNumber++ : currentSlideNumber--
    if (currentSlideNumber === lastSlideNumber || currentSlideNumber === 0) readyNextSlide()
    goToSlide(currentSlideNumber)
}

// Button click events
buttonRight.addEventListener("click", shiftSlides.bind(null, 1))
buttonLeft.addEventListener("click", shiftSlides.bind(null, 0))

// Swipes
slider.addEventListener('touchstart', handleTouchStart, false)
slider.addEventListener('touchmove', handleTouchMove, false)

let xDown = null
let yDown = null

function getTouches(evt) {
    return evt.touches ||             // browser API
        evt.originalEvent.touches // jQuery
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0]
    xDown = firstTouch.clientX
    yDown = firstTouch.clientY
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) {
        return
    }

    let xUp = evt.touches[0].clientX
    let yUp = evt.touches[0].clientY

    let xDiff = xDown - xUp
    let yDiff = yDown - yUp

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            // left swipe
            shiftSlides(1)
        } else {
            // right swipe
            shiftSlides(0)
        }
    }

    xDown = null
    yDown = null
}
// Infinity slider (end)

// Nav menu (start)
// Nav button
document.addEventListener("click", function (e) {

    let header_nav_items = document.querySelector('.header_nav_items')
    let header_nav_button = document.querySelector('.header_nav_button')

    if (getComputedStyle(header_nav_button).display != 'none') {

        if (e.target.className != 'header_nav_button' && e.target.className != 'header_nav_items') {
            header_nav_items.style.display = 'none'
        } else if (e.target.className == 'header_nav_button') {
            header_nav_items.style.display = (header_nav_items.style.display != 'block') ? 'block' : 'none'
        }
    }
})

// Visibility nav after resizing window
window.addEventListener('resize', function() {

    let header_nav_items = document.querySelector('.header_nav_items')
    let header_nav_button = document.querySelector('.header_nav_button')

    if (getComputedStyle(header_nav_button).display === 'none' && header_nav_items.style.display === 'none') {
        header_nav_items.style.display = 'block'
    } else if (getComputedStyle(header_nav_button).display != 'none' && header_nav_items.style.display === 'block') {
        header_nav_items.style.display = 'none'
    }
})
// Nav menu (end)

// Responsive slider height (start)
function setSliderMaxHeight() {

    let sliderItemMaxHeight = 0

    for (let sliderItem of Object.values(slides)) {
        if (sliderItemMaxHeight < sliderItem.offsetHeight) {
            sliderItemMaxHeight = sliderItem.offsetHeight
        }
    }
    slider.style.height = sliderItemMaxHeight + 'px'
}

window.addEventListener('load', function() {
    setSliderMaxHeight()
})

window.addEventListener('resize', function() {
    setSliderMaxHeight()
})
// Responsive slider height (end)