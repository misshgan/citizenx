// JavaScript files are compiled and minified during the build process to the assets/built folder. See available scripts in the package.json file.

// Import CSS
import "../css/index.css";

import tocbot from "tocbot";
import fslightbox from "fslightbox";
import lazySizes from "lazysizes";
import GhostContentAPI from "@tryghost/content-api";

// core version + navigation module:
import Swiper from "swiper";
// import Swiper and modules styles
import "swiper/css";

function handleSwiper() {
    const swiper = new Swiper(".swiper", {
        direction: "horizontal",
        loop: false,
        slidesPerView: "auto",
    });

    setTimeout(() => {
        const activeSlide = document.querySelector(".swiper-slide.active");
        if (activeSlide) {
            const index = [...activeSlide.parentElement.children].indexOf(activeSlide);

            const slideBounds = activeSlide.getBoundingClientRect();
            const swiperBounds = swiper.el.getBoundingClientRect();

            const isSlideVisible =
                slideBounds.left >= swiperBounds.left &&
                slideBounds.right <= swiperBounds.right;

            if (!isSlideVisible) {
                swiper.slideTo(index, 500);
            }
        }
    }, 0);
}



handleSwiper();

function handleStickyBars() {
    const header = document.querySelector(".js-sticky-header");
    const footer = document.querySelector(".js-sticky-footer");

    if (!header || !footer) {
        return;
    }

    window.addEventListener("scroll", () => {
        if (window.scrollY > 250) {
            header.style.top = "0";
        } else {
            header.style.top = "-100%";
        }

        if (window.scrollY > 1000) {
            footer.style.bottom = "0";
        } else {
            footer.style.bottom = "-100%";
        }
    });
}

handleStickyBars();

function handleProgressBar() {
    // Select the progress bar element
    const progressBar = document.querySelector(".js-progress-bar");

    if (!progressBar) {
        return;
    }

    // Function to update the progress bar
    const updateProgressBar = () => {
        const scrollTop =
            document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;

        // Set the width of the progress bar
        progressBar.style.width = `${scrollPercentage}%`;
    };

    // Add scroll event listener
    window.addEventListener("scroll", updateProgressBar);
}

handleProgressBar();

function handleScrollToTop() {
    const buttons = document.querySelectorAll(".js-scroll-to-top");

    if (buttons.length < 1) {
        return;
    }

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth", // Smooth scroll effect
            });
        });
    });
}

handleScrollToTop();

function handleTocbot() {
    if (document.body.classList.contains("post-template")) {
        tocbot.init({
            // Where to render the table of contents.
            tocSelector: ".js-toc",
            // Where to grab the headings to build the table of contents.
            contentSelector: ".js-toc-content",
            // Which headings to grab inside of the contentSelector element.
            headingSelector: "h2",
        });
    }
}

handleTocbot();

function handleMobileNavOpen() {
    const headers = document.querySelectorAll(".js-header");

    headers.forEach((header) => {
        setListeners(header);
    });

    function setListeners(header) {
        const target = header.querySelector(".js-header-mobile-nav-target");
        const mobileNav = header.querySelector(".js-mobile-nav");

        if (!target || !mobileNav) {
            return;
        }

        target.addEventListener("click", () => {
            target.classList.toggle("active");
            mobileNav.classList.toggle("active");
        });
    }
}

handleMobileNavOpen();

// function handleHeaderForm() {
//     const headers = document.querySelectorAll(".js-header");

//     headers.forEach((header) => {
//         setListeners(header);
//     });

//     function setListeners(header) {
//         const button = header.querySelector(".js-form-button");
//         const form = header.querySelector(".js-form");

//         if (!button || !form) {
//             return;
//         }

//         const logo = header.querySelector(".js-mobile-logo");
//         let isFirstClick = true;

//         button.addEventListener("click", (e) => {
//             if (isFirstClick) {
//                 e.preventDefault();
//                 button.classList.toggle("active");
//                 form.classList.toggle("active");
//                 logo.classList.toggle("active");
//                 isFirstClick = false;
//             }
//         });
//     }
// }

// handleHeaderForm();

function handleHeaderForm() {
    const headers = document.querySelectorAll(".js-header");

    headers.forEach((header) => {
        setListeners(header);
    });

    function setListeners(header) {
        const button = header.querySelector(".js-form-button");
        const form = header.querySelector(".js-form");
        const input = form?.querySelector("input[type='email']");

        if (!button || !form || !input) {
            return;
        }

        const logo = header.querySelector(".js-mobile-logo");
        let isFirstClick = true;

        button.addEventListener("click", async (e) => {
            if (isFirstClick) {
                e.preventDefault();
                button.classList.toggle("active");
                form.classList.toggle("active");
                logo?.classList.toggle("active");
                isFirstClick = false;
            } else {
                e.preventDefault();

                const email = input.value.trim();
                if (!email || !validateEmail(email)) {
                    form.classList.add("error");
                    setTimeout(() => form.classList.remove("error"), 3000);
                    return;
                }

                try {
                    button.classList.add("loading");

                    const response = await fetch("https://api.citizenx.com/account/newsletter", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email }),
                    });

                    if (!response.ok) {
                        throw new Error("Failed to subscribe. Please try again.");
                    }

                    form.classList.add("success");
                    form.reset();
                } catch (error) {
                    form.classList.add("error");
                } finally {
                    button.classList.remove("loading");
                    setTimeout(() => {
                        form.classList.remove("success");
                        form.classList.remove("error");
                    }, 3000);
                }
            }
        });
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

handleHeaderForm();

function handleForms() {
    const forms = document.querySelectorAll(".js-form-secondary");

    forms.forEach((form) => {
        setListeners(form);
    });

    function setListeners(form) {
        const button = form.querySelector(".js-form-button");
        const input = form?.querySelector("input[type='email']");

        if (!button || !form || !input) {
            return;
        }
        button.addEventListener("click", async (e) => {
            e.preventDefault();

            const email = input.value.trim();
            if (!email || !validateEmail(email)) {
                form.classList.add("error");
                setTimeout(() => form.classList.remove("error"), 3000);
                return;
            }

            try {
                form.classList.add("loading");

                const response = await fetch("https://api.citizenx.com/account/newsletter", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                });

                if (!response.ok) {
                    throw new Error("Failed to subscribe. Please try again.");
                }

                form.classList.add("success");
                form.reset();
            } catch (error) {
                form.classList.add("error");
            } finally {
                form.classList.remove("loading");
                setTimeout(() => {
                    form.classList.remove("success");
                    form.classList.remove("error");
                }, 3000);
            }
        });
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

handleForms();

function handleLightbox() {
    const images = document.querySelectorAll(
        ".kg-image-card img, .kg-gallery-card img"
    );

    if (images.length < 1) {
        return;
    }

    // Lightbox function
    images.forEach(function (image) {
        var wrapper = document.createElement("a");
        wrapper.setAttribute("data-no-swup", "");
        wrapper.setAttribute("data-fslightbox", "");
        wrapper.setAttribute("href", image.src);
        wrapper.setAttribute("aria-label", "Click for Lightbox");
        image.parentNode.insertBefore(wrapper, image.parentNode.firstChild);
        wrapper.appendChild(image);
    });

    refreshFsLightbox();
}

handleLightbox();

function handleLogoScroll() {
    const track = document.querySelector(".icon-track");

    const icons = Array.from(track.children);
    icons.forEach((icon) => {
        const clone = icon.cloneNode(true);
        track.appendChild(clone);
    });

    let scrollPos = 0;

    function animateIcons() {
        scrollPos -= 0.75;
        if (scrollPos <= -track.scrollWidth / 2) {
            scrollPos = 0;
        }
        track.style.transform = `translateX(${scrollPos}px)`;
        requestAnimationFrame(animateIcons);
    }

    animateIcons();
}

handleLogoScroll();

function handleLoadMore() {
    // const api = new GhostContentAPI({
    //     url: "https://citizenx.com/insights",
    //     key: "0f730514f40b8c02ecf01d54e5",
    //     version: "v5.0",
    // });

    const api = new GhostContentAPI({
        url: "http://localhost:2368",
        key: "bac39dba3e4a73fbc0f81cbdec",
        version: "v5.0",
    });

    function createArticleCard(post) {
        let postCard = `<article class="card card--default">`;

        if (post.feature_image) {
            postCard += `
              <a href="${post.url}">
                  <picture>
                    <img src="${imgUrlWithFormat(
                        post.feature_image
                    )}" class="card__image lazyload" alt="${post.title}">
                  </picture>
              </a>
          `;
        }

        postCard += `
          <h2 class="card__title">
              <a href="${post.url}">${post.title}</a>
          </h2>
      `;

        if (post.custom_excerpt) {
            postCard += `
              <p class="card__subtitle">${post.custom_excerpt}</p>
          `;
        }

        const options = { month: "short", day: "numeric" };
        const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
            new Date(post.published_at)
        );

        const primaryTag = post.primary_tag
            ? `
            <span class="card__tag">
                <small>·</small>
                ${post.primary_tag.name}
            </span>
        `
            : "";

        postCard += `
        <div class="card__footer">
            <span class="card__author">${post.primary_author.name}</span>
            <span class="card__time"><time datetime="${new Date(
                post.published_at
            ).toISOString()}">${formattedDate}</time></span>
            ${primaryTag}
        </div>
      `;

        postCard += `</article>`;

        return postCard;
    }

    function imgUrlWithFormat(featureImage, size = "s", format = null) {
        if (!featureImage) {
            throw new Error("Feature image URL is required");
        }

        // Проверяем, является ли это URL с Unsplash
        const unsplashRegex = /^https:\/\/images\.unsplash\.com\//;
        const isUnsplash = unsplashRegex.test(featureImage);

        // Если изображение с Unsplash, изменяем параметры fm и w
        if (isUnsplash) {
            let modifiedUrl = new URL(featureImage);

            // Меняем формат (fm) если указан
            if (format) {
                modifiedUrl.searchParams.set("fm", format);
            }

            // Меняем ширину (w) на соответствующий размер
            const widthMapping = {
                xxs: 30,
                xs: 100,
                s: 300,
                m: 600,
                l: 1200,
                xl: 2000,
            };

            const width = widthMapping[size] || 2000; // Если не найден размер, ставим максимальный
            modifiedUrl.searchParams.set("w", width);

            return modifiedUrl.toString();
        }

        // Для остальных URL (например, с вашего сервера), продолжаем использовать логику с /content/images/
        const marker = "/content/images/";
        if (!featureImage.includes(marker)) {
            throw new Error(
                'Invalid feature image URL: URL must contain "/content/images/"'
            );
        }

        const [baseUrl, imagePath] = featureImage.split(marker);
        if (!imagePath) {
            throw new Error("Invalid feature image URL: image path is missing");
        }

        let resizedImageUrl = `${baseUrl}${marker}size/${size}/${imagePath}`;
        if (format) {
            resizedImageUrl = resizedImageUrl.replace(/\.\w+$/, `.${format}`);
        }

        return resizedImageUrl;
    }

    // Function to fetch content based on parameters
    async function fetchContent(filter, limit, page) {
        try {
            let response;

            response = await api.posts.browse({
                filter: filter,
                limit: limit,
                page: page,
                include: "tags,authors",
            });

            return response;
        } catch (error) {
            console.error("Error fetching content:", error);
            return [];
        }
    }

    document.addEventListener("DOMContentLoaded", async function () {
        const loadMoreBlock = document.querySelector(".js-load-more");

        if (!loadMoreBlock) {
            return;
        }

        const limit = parseInt(loadMoreBlock.getAttribute("data-limit")) || 6;
        let filter = loadMoreBlock.getAttribute("data-filter") || "";
        const excludeFirstPost = loadMoreBlock.getAttribute(
            "data-exclude-first-post"
        );

        if (excludeFirstPost === "true") {
            let excludedPostId = null;

            try {
                const latestPost = await api.posts.browse({
                    limit: 1,
                    order: "published_at DESC",
                });
                excludedPostId = latestPost[0]?.id || null;
            } catch (error) {
                console.error("Error fetching the latest post:", error);
            }

            if (excludedPostId) {
                filter += `${filter ? "+" : ""}id:-${excludedPostId}`;
            }
        }

        let currentPage = 1;
        let totalPages = 1;

        const loadMoreBtn = document.createElement("button");
        loadMoreBtn.innerHTML = `
            Load more

            <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
                y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
                <path opacity="0.2" fill="#000" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
            s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
            c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z" />
                <path fill="#000" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
            C22.32,8.481,24.301,9.057,26.013,10.047z">
                    <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20"
                        dur="0.5s" repeatCount="indefinite" />
                </path>
            </svg>
        `;
        loadMoreBtn.classList = "load-more-button button button--accent";
        loadMoreBtn.style.display = "none";
        loadMoreBlock.parentNode.insertBefore(
            loadMoreBtn,
            loadMoreBlock.nextSibling
        );

        function renderCards(items) {
            loadMoreBlock.classList.add("loaded");
            const cardContainer = loadMoreBlock;
            items.forEach((item) => {
                let cardHTML = "";

                cardHTML = createArticleCard(item);

                if (cardHTML) {
                    cardContainer.insertAdjacentHTML("beforeend", cardHTML);
                }
            });

            loadMoreBlock
                .querySelectorAll(".card-skeleton")
                .forEach((card) => card.remove());
        }

        async function loadContent() {
            if (currentPage > totalPages) return;

            loadMoreBlock.classList.add("loading");

            const data = await fetchContent(filter, limit, currentPage);

            renderCards(data);

            if (data.meta && data.meta.pagination) {
                totalPages = data.meta.pagination.pages;
            } else {
                totalPages = currentPage + 1;
            }

            if (currentPage < totalPages) {
                loadMoreBtn.style.display = "block";
            } else {
                loadMoreBtn.style.display = "none";
            }

            loadMoreBlock.classList.remove("loading");

            currentPage++;
        }

        loadContent();

        loadMoreBtn.addEventListener("click", loadContent);
    });
}
// handleLoadMore();

function handleCopyUrlButton() {
    const copyUrlButtons = document.querySelectorAll(".js-copy-url");

    if (copyUrlButtons.length < 1) {
        return;
    }

    copyUrlButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            try {
                // Copy the current page URL to the clipboard
                await navigator.clipboard.writeText(window.location.href);

                // Show feedback to the user
                button.style.width = "max-content";
                button.textContent = "Copied!";

                // Hide the feedback after 2 seconds
                setTimeout(() => {
                    button.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
                            <path d="M10.9202 3.29589L11.5606 2.59825C12.6778 1.38093 14.4955 1.38135 15.6127 2.59846C16.1538 3.18794 16.4518 3.9718 16.4518 4.80563C16.4518 5.63946 16.1538 6.42311 15.6127 7.0128L13.437 9.38314C12.8957 9.97283 12.176 10.2975 11.4108 10.2975C10.6456 10.2975 9.92609 9.97283 9.38481 9.38314C8.58343 8.5101 8.32953 7.20149 8.73767 6.04931C8.89171 5.61479 8.69335 5.12651 8.29431 4.9589C7.89566 4.79129 7.44727 5.00718 7.29342 5.44191C6.66467 7.21625 7.05577 9.23135 8.28986 10.5758C9.12355 11.484 10.2317 11.9841 11.4106 11.9841C12.5895 11.9841 13.6976 11.484 14.5313 10.5758L16.7073 8.20545C17.541 7.2972 18 6.09 18 4.80584C18.0002 3.52147 17.541 2.31406 16.7073 1.40602C15.8469 0.468675 14.7167 0 13.5864 0C12.4564 0 11.326 0.468675 10.4658 1.40581L9.82545 2.10344C9.52298 2.43296 9.52298 2.96678 9.82545 3.2961C10.1275 3.6252 10.6181 3.6252 10.9202 3.29589ZM1.29057 12.5941C3.01156 14.4688 5.81124 14.4685 7.53222 12.5941L8.17259 11.8964C8.47506 11.5669 8.47506 11.0331 8.17259 10.7038C7.8705 10.3745 7.37992 10.3745 7.07803 10.7038L6.43766 11.4014C5.32066 12.6181 3.50252 12.6185 2.38552 11.4014C1.26832 10.1843 1.26851 8.20377 2.38552 6.98686L4.56089 4.61673C5.67771 3.39961 7.49565 3.39961 8.61285 4.61673C9.41441 5.48998 9.66812 6.79859 9.25998 7.95056C9.10594 8.38508 9.3043 8.87336 9.70334 9.04097C10.1026 9.20921 10.5504 8.99227 10.7042 8.55796C11.333 6.78384 10.9419 4.76874 9.70779 3.42386C8.84759 2.48652 7.71742 2.01805 6.58706 2.01805C5.4569 2.01805 4.32673 2.48673 3.46634 3.42386L1.29077 5.79421C-0.430222 7.66889 -0.430222 10.7192 1.29057 12.5941Z" fill="#020712"/>
                        </svg>
                    `;
                    button.style.width = "3.4rem";
                }, 2000);
            } catch (err) {
                console.error("Failed to copy URL: ", err);
                button.textContent = "Error :(";

                // Hide the feedback after 2 seconds
                setTimeout(() => {
                    button.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 18 14" fill="none">
                            <path d="M10.9202 3.29589L11.5606 2.59825C12.6778 1.38093 14.4955 1.38135 15.6127 2.59846C16.1538 3.18794 16.4518 3.9718 16.4518 4.80563C16.4518 5.63946 16.1538 6.42311 15.6127 7.0128L13.437 9.38314C12.8957 9.97283 12.176 10.2975 11.4108 10.2975C10.6456 10.2975 9.92609 9.97283 9.38481 9.38314C8.58343 8.5101 8.32953 7.20149 8.73767 6.04931C8.89171 5.61479 8.69335 5.12651 8.29431 4.9589C7.89566 4.79129 7.44727 5.00718 7.29342 5.44191C6.66467 7.21625 7.05577 9.23135 8.28986 10.5758C9.12355 11.484 10.2317 11.9841 11.4106 11.9841C12.5895 11.9841 13.6976 11.484 14.5313 10.5758L16.7073 8.20545C17.541 7.2972 18 6.09 18 4.80584C18.0002 3.52147 17.541 2.31406 16.7073 1.40602C15.8469 0.468675 14.7167 0 13.5864 0C12.4564 0 11.326 0.468675 10.4658 1.40581L9.82545 2.10344C9.52298 2.43296 9.52298 2.96678 9.82545 3.2961C10.1275 3.6252 10.6181 3.6252 10.9202 3.29589ZM1.29057 12.5941C3.01156 14.4688 5.81124 14.4685 7.53222 12.5941L8.17259 11.8964C8.47506 11.5669 8.47506 11.0331 8.17259 10.7038C7.8705 10.3745 7.37992 10.3745 7.07803 10.7038L6.43766 11.4014C5.32066 12.6181 3.50252 12.6185 2.38552 11.4014C1.26832 10.1843 1.26851 8.20377 2.38552 6.98686L4.56089 4.61673C5.67771 3.39961 7.49565 3.39961 8.61285 4.61673C9.41441 5.48998 9.66812 6.79859 9.25998 7.95056C9.10594 8.38508 9.3043 8.87336 9.70334 9.04097C10.1026 9.20921 10.5504 8.99227 10.7042 8.55796C11.333 6.78384 10.9419 4.76874 9.70779 3.42386C8.84759 2.48652 7.71742 2.01805 6.58706 2.01805C5.4569 2.01805 4.32673 2.48673 3.46634 3.42386L1.29077 5.79421C-0.430222 7.66889 -0.430222 10.7192 1.29057 12.5941Z" fill="#020712"/>
                        </svg>
                    `;
                }, 2000);
            }
        });
    });
}

handleCopyUrlButton();
