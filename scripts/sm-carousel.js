import dataList from './data.js';

let carousels = document.querySelectorAll('.sm-carousel');

dataList.forEach((item,index)=>populateCarousels(item,index));

// Getting the carousel, scroller and slides.

carousels.forEach(carousel=>{

    let scroller = carousel.querySelector('.sm-scroller');
    let allSlides = scroller.querySelectorAll('.sm-slide');
    
    let slideCount = allSlides.length;
    let slides = null;
    
    let slideWidth = allSlides[0].offsetWidth;
    let earlyClick = false;
    
    let initialX = null;
    
    scroller.insertBefore(scroller.lastElementChild,scroller.firstElementChild);
    if(slideCount>3){
        scroller.insertBefore(scroller.lastElementChild,scroller.firstElementChild);
    }
    
    initializeSlides();
    
    scroller.addEventListener('scroll',resizeOnScroll);
    if(scroller.children.length!==0){
        scroller.scrollBy({left: slideWidth*1.5});
        console.log(scroller.children);
    }
    else {
        console.log('Scroller is empty');
    }
    scroller.addEventListener('click',scrollOnTap);
    
    scroller.addEventListener('touchstart',setInitialX);
    scroller.addEventListener('touchend',scrollBySwipe);
    
    
    function initializeSlides () {
        if(slideCount<2){
            return
        }
        else if(slideCount<5){
            let firstClone = scroller.firstElementChild.cloneNode(true);
            let lastClone = scroller.lastElementChild.cloneNode(true);
            let lastClone2 = scroller.lastElementChild.cloneNode(true);
            scroller.appendChild(firstClone);
            if(slideCount<4){
                scroller.insertBefore(lastClone,scroller.firstElementChild);
                if(slideCount<3){
                    scroller.appendChild(lastClone2);
                }
            }
            slides = scroller.querySelectorAll('.sm-slide');
        }
        else{
            slides = scroller.querySelectorAll('.sm-slide');
        }
        slides[2].classList.add('spotlight');
        setArtData();
        
    }
    
    function resizeOnScroll () {
        Array.from(scroller.children).forEach(slide=>{
            let slideContent = slide.querySelector('.sm-slide-content');
            let scrollerHalfWidth = scroller.offsetWidth/2;
            let scrollerLeft = scroller.getBoundingClientRect().left;
            let slideLeft = slide.getBoundingClientRect().left;
            let slideCenter = slideLeft + (slideWidth/2) - scrollerLeft;
    
            if((slideCenter+(slideWidth/2))>=scrollerLeft&&(slideCenter-(slideWidth/2))<=scrollerHalfWidth*2){
                slideContent.style.transform = `scale(${1-0.16*(Math.abs((slideCenter-scrollerHalfWidth)/scrollerHalfWidth))})`;
            }
        });
    }
    
    function scrollOnTap (e) {
        if(earlyClick){
            return;
        }
        if(e.clientX>window.innerWidth*0.75){
            scrollToLeft();
        }
        if(e.clientX<window.innerWidth*0.25){
            scrollToRight();
        }
    }
    
    function setInitialX (e) {
        if(earlyClick){
            return;
        }
        initialX = e.touches[0].clientX;
    }
    
    
    function scrollBySwipe (e) {
        if(earlyClick) {
            return;
        }
        let distance = e.changedTouches[0].clientX - initialX;
        if(Math.abs(distance)>=100){
            if(distance<0){
                scrollToLeft();
            }
            else if(distance>0){
                scrollToRight();
            }
            else if(distance===0) {
                return;
            }
        }
        initialX = null;
    
    }
    
    
    
    function scrollToLeft () {
        earlyClick = true;
        scroller.scrollBy({left: slideWidth, behavior: "smooth"});
        let activeSlide = scroller.querySelector('.spotlight');
        activeSlide.nextElementSibling.classList.add('spotlight');
        activeSlide.classList.remove('spotlight');
        setArtData();
        setTimeout(() => {
            if(slideCount<5){
                let clone = scroller.children[5-slideCount].cloneNode(true);
                scroller.removeChild(scroller.firstElementChild);
                scroller.appendChild(clone);
            }
            else {
                scroller.appendChild(scroller.firstElementChild);
            }
            scroller.scrollLeft = slideWidth*1.5;
            earlyClick = false;
        }, 500);
    }
    
    function scrollToRight () {
        earlyClick = true;
        scroller.scrollBy({left: -slideWidth, behavior: "smooth"});
        let activeSlide = scroller.querySelector('.spotlight');
        activeSlide.previousElementSibling.classList.add('spotlight');
        activeSlide.classList.remove('spotlight');
        setArtData();
        setTimeout(() => {
            if(slideCount<5){
                let clone = scroller.children[scroller.children.length-1-(5-slideCount)].cloneNode(true);
                scroller.removeChild(scroller.lastElementChild);
                scroller.insertBefore(clone,scroller.firstElementChild);
            }
            else {
                scroller.insertBefore(scroller.lastElementChild, scroller.firstElementChild);
            }
            scroller.scrollLeft = slideWidth*1.5;
            earlyClick = false;
        }, 500);
    }
    
    function setArtData () {
        let activeArt = carousel.querySelector('.spotlight').querySelector('.sm-slide-content');
        let artName = carousel.querySelector('.art-name');
        let artPrice = carousel.querySelector('.art-price');
        let orderBtn = carousel.querySelector('.order-now');
        artName.innerText = activeArt.getAttribute('art-name');
        artPrice.innerText = activeArt.getAttribute('art-price');
    }
});

function populateCarousels (item,index) {
    let slideItem = document.createElement('div');
    slideItem.classList.add('sm-slide');
    let slideContent = document.createElement('div');
    slideContent.classList.add('sm-slide-content');
    slideContent.setAttribute('art-name',`${item.name}`);
    slideContent.setAttribute('art-price',`${item.price}`);
    slideContent.style.backgroundImage = `url("${item.path}")`;
    slideItem.appendChild(slideContent);
    if(index%2){
        let scroller = carousels[0].querySelector('.sm-scroller');
        scroller.appendChild(slideItem);
    }
    else{
        let scroller = carousels[1].querySelector('.sm-scroller');
        scroller.appendChild(slideItem);
    }
}

