// JavaScript files are compiled and minified during the build process to the assets/built folder. See available scripts in the package.json file.

// Import CSS
import "../css/index.css";

// import Swiper JS
import Swiper from 'swiper';
import { Autoplay } from "swiper/modules";

import tocbot from 'tocbot'

// import Swiper styles
import 'swiper/css';

function handleSwiper () {

    const swiper = new Swiper('.swiper', {
        modules: [Autoplay],

        direction: 'horizontal',
        loop: true,
        slidesPerView: '3',
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
        }, 
        speed: 2000,

        breakpoints: {
            320: {
              slidesPerView: 2
            },
            480: {
              slidesPerView: 3,
            },
            640: {
              slidesPerView: 4,
            },
            1024: {
                slidesPerView: 6
            },
            1240: {
                slidesPerView: 8
            }
        }
      
      });

}

handleSwiper();

function handleStickyBars() {
    const header = document.querySelector('.js-sticky-header');
    const footer = document.querySelector('.js-sticky-footer');

    if (!header || !footer) { return; }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 250) {
            header.style.top = '0';
        } else {
            header.style.top = '-100%'
        }

        if (window.scrollY > 1000) {
            footer.style.bottom = '0'
        } else {
            footer.style.bottom = '-100%'
        }
    })
}

handleStickyBars();

function handleProgressBar() {
    // Select the progress bar element
    const progressBar = document.querySelector('.js-progress-bar');

    if (!progressBar) { return; }

    // Function to update the progress bar
    const updateProgressBar = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;

    // Set the width of the progress bar
    progressBar.style.width = `${scrollPercentage}%`;
    };

    // Add scroll event listener
    window.addEventListener('scroll', updateProgressBar);

}   

handleProgressBar();

function handleScrollToTop() {
    const buttons = document.querySelectorAll('.js-scroll-to-top');

    if (buttons.length < 1) { return; }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // Smooth scroll effect
            });
        })
    })
}

handleScrollToTop();

function handleTocbot() {

    tocbot.init({
        // Where to render the table of contents.
        tocSelector: '.js-toc',
        // Where to grab the headings to build the table of contents.
        contentSelector: '.js-toc-content',
        // Which headings to grab inside of the contentSelector element.
        headingSelector: 'h2',
    });

}

handleTocbot();