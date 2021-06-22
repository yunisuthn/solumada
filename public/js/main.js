// START SMOOTH SCROLL

// Select all links with hashes
$('a[href*="#"]')
	// Remove links that don't actually link to anything
	.not('[href="#"]')
	.not('[href="#0"]')
	.click(function(event) {
		// On-page links
		if (
			location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
			location.hostname == this.hostname
		) {
			// Figure out element to scroll to
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			// Does a scroll target exist?
			if (target.length) {
				// Only prevent default if animation is actually gonna happen
				event.preventDefault();
				$('html, body').animate({
					scrollTop: target.offset().top
				}, 1000, function() {
					// Callback after animation
					// Must change focus!
					var $target = $(target);
					$target.focus();
					if ($target.is(":focus")) { // Checking if the target was focused
						return false;
					} else {
						$target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
						$target.focus(); // Set focus again
					};
				});
			}
		}
	});

// START BOX REVEAL

var boxReveal = {
	delay : 250,
	distance : '100px'
};

window.sr = ScrollReveal();
sr.reveal('.box', boxReveal);

// START PROGRESS BAR

function progressBarScroll() {
	let winScroll = document.body.scrollTop || document.documentElement.scrollTop,
	height = document.documentElement.scrollHeight - document.documentElement.clientHeight,
	scrolled = (winScroll / height) * 100;
	document.getElementById("progressBar").style.width = scrolled + "%";
}

window.onscroll = function () {
	progressBarScroll();
};

// START LANGUAGE MENU

$(document).ready(function(){
	$('#button').click( function(showLanguage) {
		showLanguage.preventDefault();
		showLanguage.stopPropagation();
		$('.languageSelector').fadeToggle("slow");
	});
	
	$('.languageSelector').click( function(showLanguage) { 
		showLanguage.stopPropagation();
	});
	
});

// START COOKIE HIDE
/*
$(document).ready(function(){
	$('.cookieClose').click(function(){
		$('.cookie').fadeToggle("slow");
	});
});*/


/* https://github.com/madmurphy/cookies.js (GPL3) */
var docCookies={getItem:function(e){return e&&decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*"+encodeURIComponent(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1"))||null},setItem:function(e,o,t,n,r,c){if(!e||/^(?:expires|max\-age|path|domain|secure)$/i.test(e))return!1;var s="";if(t)switch(t.constructor){case Number:s=t===1/0?"; expires=Fri, 31 Dec 9999 23:59:59 GMT":"; max-age="+t;break;case String:s="; expires="+t;break;case Date:s="; expires="+t.toUTCString()}return document.cookie=encodeURIComponent(e)+"="+encodeURIComponent(o)+s+(r?"; domain="+r:"")+(n?"; path="+n:"")+(c?"; secure":""),!0},removeItem:function(e,o,t){return!!this.hasItem(e)&&(document.cookie=encodeURIComponent(e)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT"+(t?"; domain="+t:"")+(o?"; path="+o:""),!0)},hasItem:function(e){return!(!e||/^(?:expires|max\-age|path|domain|secure)$/i.test(e))&&new RegExp("(?:^|;\\s*)"+encodeURIComponent(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=").test(document.cookie)},keys:function(){for(var e=document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g,"").split(/\s*(?:\=[^;]*)?;\s*/),o=e.length,t=0;t<o;t++)e[t]=decodeURIComponent(e[t]);return e},clear:function(e,o){for(var t=this.keys(),n=t.length,r=0;r<n;r++)this.removeItem(t[r],e,o)}};"undefined"!=typeof module&&void 0!==module.exports&&(module.exports=docCookies);
//# sourceMappingURL=cookies.min.js.map

function maxAgeToGMT (nMaxAge) {
  return nMaxAge === Infinity ? "Fri, 31 Dec 9999 23:59:59 GMT" : (new Date(nMaxAge * 1e3 + Date.now())).toUTCString();
}

// const cookieBanner = document.querySelector('.cookie');
// const button = document.querySelector('.cookieClose');
let cookieRead = docCookies.getItem("GDPR");

if (!cookieRead) {
	//cookieBanner.classList.toggle("show");
	//console.log("not sure");
} else {
	//found cookie
	$('.cookie').addClass("hide");
}

// button.addEventListener('click', function(){
// 	//cookieBanner.classList.toggle('show');
// 	docCookies.setItem("GDPR", "Accepted Cookie", maxAgeToGMT);
// 	$('.cookie').fadeOut("slow");
// });