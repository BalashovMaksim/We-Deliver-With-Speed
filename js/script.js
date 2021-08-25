let buttonsub = document.querySelector('.header__lang');
buttonsub.addEventListener('click',function(){
    buttonsub.classList.toggle('_active');
    
});
let buttonsub2 = document.querySelector('.header__country');
buttonsub2.addEventListener('click',function(){
    buttonsub2.classList.toggle('_active');
})

//tabs
$(document).ready(function(){
    $('.tabs-triggers__item').click(function(e){
        e.preventDefault();
        $('.tabs-triggers__item').removeClass('tabs-triggers__item--active');
        $('.tabs-content__item').removeClass('tabs-content__item--active');

        $(this).addClass('tabs-triggers__item--active');
        $($(this).attr('href')).addClass('tabs-content__item--active');
    });
    $('.tabs-triggers__item:first').click();
});

$(document).ready(function(){
    $('.header__search').click(function(){
        $('.header__input').toggleClass('_active')
        $('.header__button').toggleClass('_active')
    })
});
//Menu Burger
$(document).ready(function(){
    $('.header__burger').click(function(event) {
        $('.header__burger, .header__menu').toggleClass('active');
        $('body').toggleClass('lock');
    })
});
//Popup
const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelector('.lock-padding');

let unlock = true;

const timeout = 800;

if(popupLinks.length > 0){
    for (let index = 0; index < popupLinks.length; index++){
        const popupLink = popupLinks[index];
        popupLink.addEventListener('click',function (e) {
            const popupName = popupLink.getAttribute('href').replace('#', '');
            const curentPopup = document.getElementById(popupName);
            popupOpen(curentPopup);
            e.preventDefault();
        });
    }
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if(popupCloseIcon.length > 0) {
    for (let i = 0; i < popupCloseIcon.length; i++){
        const el = popupCloseIcon[i];
        el.addEventListener('click', function(e){
            popupClose(el.closest('.popup'));
            e.preventDefault();
        });
    }
}

function popupOpen(curentPopup){
    if(curentPopup && unlock){
        const popupActive = document.querySelector('.popup.open');
        if (popupActive){
            popupClose(popupActive, false)
        } else {
            bodyLock();
        }
        curentPopup.classList.add('open');
        curentPopup.addEventListener('click', function(e){
            if(!e.target.closest('.popup__content')){
                popupClose(e.target.closest('.popup'));
            }
        });
    }
}
function popupClose(popupActive, doUnlock = true) {
    if (unlock){
        popupActive.classList.remove('open');
        if(doUnlock){
            bodyUnLock();
        }
    }
}
function bodyLock(){
    const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

    for(let i = 0; i < lockPadding.length; i++){
        const el = lockPadding[i];
        el.style.paddingRight = lockPaddingValue;
    }
    body.style.paddingRight = lockPaddingValue;
    body.classList.add('lock');

    unlock = false;
    setTimeout(function (){
        unlock = true;
    }, timeout)
}
function bodyUnLock(){
    setTimeout(function(){
        for (let i = 0; i < lockPadding.length; i++){
            const el = lockPadding[index];
            el.style.paddingRight = '0px';
        }
        body.style.paddingRight = '0px';
        body.classList.remove('lock');
    }, timeout);
    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

document.addEventListener('keydown', function(e){
    if(e.which === 27){
        const popupActive = document.querySelector('.popup.open');
        popupClose(popupActive);
    }
});


//Скрипт фона
function ibg(){
    $.each($('.ibg'), function(index, val) {
        if($(this).find('img').length>0){
            $(this).css('background-image','url("'+$(this).find('img').attr('src')+'")');
        }
    });
}
ibg();
"use strict"
//Spoiler
const spoilersArray = document.querySelectorAll('[data-spoilers]');
if(spoilersArray.length > 0){
    //Получение спойлеров
    const spoilersRegular = Array.from(spoilersArray).filter(function(item,index,self){
        return !item.dataset.spoilers.split(",")[0];
    });
    if(spoilersRegular.length > 0){
        initSpoilers(spoilersRegular);
    }

    //Получение спойлеров с медиа запросами
    const spoilersMedia = Array.from(spoilersArray).filter(function (item,index,self){
        return item.dataset.spoilers.split(",")[0];
    });

    //Инициализация спойлеров с медиа запросами
    if(spoilersMedia.length > 0){
        const breakpointsArray = [];
        spoilersMedia.forEach(item => {
            const params = item.dataset.spoilers;
            const breakpoint = {};
            const paramsArray = params.split(",");
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
        });

        //Получаем уникальные брейкпоинты 
        let mediaQueries = breakpointsArray.map(function(item){
            return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
        });
        mediaQueries = mediaQueries.filter(function(item,index,self){
            return self.indexOf(item) === index;
        });

        //Работаем с каждым брейкпоинтом
        mediaQueries.forEach(breakpoint =>{
            const paramsArray = breakpoint.split(",");
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);

            //Объекты с нужным условием
            const spoilersArray = breakpointsArray.filter(function(item){
                if(item.value === mediaBreakpoint && item.type === mediaType){
                    return true;
                }
            });
            //Событие 
            matchMedia.addListener(function(){
                initSpoilers(spoilersArray, matchMedia);
            });
            initSpoilers(spoilersArray, matchMedia);
        });
    }
    //Инициализация
    function initSpoilers(spoilersArray, matchMedia = false){
        spoilersArray.forEach(spoilersBlock => {
            spoilersBlock = matchMedia ? spoilersBlock.item : spoilersBlock;
            if(matchMedia.matches || !matchMedia){
                spoilersBlock.classList.add('_init');
                initSpoilerBody(spoilersBlock);
                spoilersBlock.addEventListener('click', setSpoilerAction);
            } else {
                spoilersBlock.classList.remove('_init');
                initSpoilerBody(spoilersBlock, false);
                spoilersBlock.removeEventListener('click', setSpoilerAction);
            }
        });
    }
    //Работа с контентом 
    function initSpoilerBody(spoilersBlock, hideSpoilerBody = true){
        const spoilerTitles = spoilersBlock.querySelectorAll('[data-spoiler]');
        if (spoilerTitles.length > 0){
            spoilerTitles.forEach(spoilerTitle => {
                if(hideSpoilerBody){
                    spoilerTitle.removeAttribute('tabindex');
                    if(!spoilerTitle.classList.contains('_active')){
                        spoilerTitle.nextElementSibling.hidden = true;
                    }
                } else{
                    spoilerTitle.setAttribute('tabindex', '-1');
                    spoilerTitle.nextElementSibling.hidden = false;
                }
            });
        }
    }
    function setSpoilerAction(e){
        const el = e.target;
        if(el.hasAttribute('data-spoiler') || el.closest('[data-spoiler]')) {
            const spoilerTitle = el.hasAttribute('data-spoiler') ? el : el.closest('[data-spoiler]');
            const spoilersBlock = spoilerTitle.closest('[data-spoilers]');
            const oneSpoiler = spoilersBlock.hasAttribute('data-one-spoiler') ? true : false;
            if(!spoilersBlock.querySelectorAll('._slide').length){
                if(oneSpoiler && !spoilerTitle.classList.contains('_active')){
                    hideSpoilerBody(spoilersBlock);
                }
                spoilerTitle.classList.toggle('_active');
                _slideToggle(spoilerTitle.nextElementSibling, 500);
            }
            e.preventDefault();
        }
    }
    function hideSpoilerBody(spoilersBlock){
        const spoilerActiveTitle = spoilersBlock.querySelector('[data-spoiler]._active');
        if(spoilerActiveTitle){
            spoilerActiveTitle.classList.remove('_active');
            _slideUp(spoilerActiveTitle.nextElementSibling,500)
        }
    }
}
//SlideToggle
let _slideUp = (target, duration = 500) => {
    if(!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.hidden = true;
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration)
    }
}
let _slideDown = (target, duration = 500) => {
    if(!target.classList.contains('_slide')){
        target.classList.add('_slide');
        if(target.hidden){
            target.hidden = false;
        }
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration)
    }
}
let _slideToggle = (target, duration = 500) => {
    if(target.hidden){
        return _slideDown(target, duration)
    } else {
        return _slideUp(target,duration)
    }
}
//Header Scroll
const menuLink = document.querySelectorAll('.header__link[data-goto]');

if(menuLink.length > 0){
    menuLink.forEach(menuLink => {
        menuLink.addEventListener('click', onMenuLinkClick)
        
    })
    function onMenuLinkClick(e){
        const menuLink = e.target;
        if(menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)){
            const gotoBlock = document.querySelector(menuLink.dataset.goto);
            const gotoBlockValue = gotoBlock.getBoundingClientRect().top;
            const headerMenu = document.querySelector('.header__menu');
            const headerBurger = document.querySelector('.header__burger');
            const body = document.body

            window.scrollTo({
                top: gotoBlockValue,
                behavior:"smooth"
            });
            e.preventDefault();
            headerBurger.classList.remove('active');
            headerMenu.classList.remove('active');
            body.classList.remove('lock');
        }
    }
}
//WEBP
function testWebP(callback) {

    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}
    
testWebP(function (support) {
    if (support == true) {
        document.querySelector('body').classList.add('webp');
    }else{
        document.querySelector('body').classList.add('no-webp');
    }
});

AOS.init();