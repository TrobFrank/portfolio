/* APP.JS */
/* FUNCTIONS */

/* used to get viewport size //returns wh[0] = width, wh[1] = height */
function getCurrentViewport() {
	if (window.innerWidth !== undefined && window.innerHeight !== undefined) { 
	    w = window.innerWidth;
	    h = window.innerHeight;
	    wh = [w,h];
	    return wh;
	} else {  
	    w = document.documentElement.clientWidth;
	    h = document.documentElement.clientHeight;
	    wh = [w,h];
	    return wh; 
	}
}

/* used to get position of element relative to document //returns el.top, el.left */
function offset(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return {
    	top:  rect.top  + scrollTop,
    	left: rect.left + scrollLeft
    }
}

function inView($element,$currentScrollY) {
  	var $elementPos = offset($element);
	if ($currentScrollY > ($elementPos.top - $wh[1])) {return true;}
	else {return false;}
  //return !((eb.top + eb.height < 0) || (eb.top > sb.height));
}

function updateInView($currentScrollY) {
  for (let $content of $contentToFade) {
    if (inView($content, $currentScrollY))	{$content.classList.add('active');}
    else 									{$content.classList.remove('active');}
  }
}

/* VARS */
var $body 					= document.querySelector('body');
var $header 				= document.querySelector('header');
var $main 					= document.querySelector('main');
var $footer 				= document.querySelector('footer');
var $footerLinks			= document.querySelector('.content-section-links');
var $mainNav 				= document.querySelector('.nav-primary');
var $mainNavLinks 			= document.querySelectorAll('.anchNav');
var $contentToFade 			= document.querySelectorAll('.scroll-transition');
var $tabClassList 			= ["invisible", "inactive","opacity-0"];
var $tabClassListVisible 	= ["visible","active",	"opacity-1"];

var $wh = getCurrentViewport(); //wh[0] = width, wh[1] = height
window.addEventListener("orientationchange", function() {
  	var $wh = getCurrentViewport();
	console.log('orientationchange: '+$wh);
});

window.addEventListener("resize", function() {
  	var $wh = getCurrentViewport();
  	console.log('resize: '+$wh);
});


var $50vw = $wh[0]/2; 	var $50vh = $wh[1]/2; 	
var $33vw = $wh[0]/3;	var $33vh = $wh[1]/3;
var $20vw = $wh[0]/5;	var $20vh = $wh[1]/5;
var $10vw = $wh[0]/10;	var $10vh = $wh[1]/10;

var $heroArea 				= document.querySelector('.hero');
var $headerShapes			= document.querySelector('.header-shapes');
var $heroInner 				= document.querySelector('.hero-inner');
var $heroFilter 			= document.querySelector('.hero-filter');
var $heroFilterOffset 		= offset($heroFilter);
var $posBeginFilterTranform = $heroFilterOffset.top - $33vh;


window.addEventListener('scroll', function(e) {
	var $scrollY = $body.scrollTop;
	var $scrollX = $body.scrollLeft;

	/* Navigation Transition */
	if ($scrollY < $33vh) {
		 $mainNav.classList.add('opacity-1');
		 $mainNav.classList.remove('opacity-0', 'fixed', 'show-bg', 'pre-fixed');
		 $heroFilter.style.bottom 	= '-50%';
	}

	if ($scrollY > $33vh && $scrollY < $wh[1]) {
		 $mainNav.classList.add('opacity-0','pre-fixed');
		 $mainNav.classList.remove('opacity-1', 'show-bg');
	}

	if ($scrollY > $wh[1]) {
		$mainNav.classList.remove('opacity-0','pre-fixed');
		$mainNav.classList.add('opacity-1', 'fixed', 'show-bg');
		$heroFilter.style.bottom 	= '0%';
		$footerLinks.classList.add('scrolled');
	} else {
		$footerLinks.classList.remove('scrolled');
	}

	/* Gradient Transition like Spotify/YouTube */
	if ($scrollY >= $posBeginFilterTranform) {
		var $percentageScrolled 	= ((($scrollY-$posBeginFilterTranform)/$posBeginFilterTranform) * 100)/1.1;
		var $percentToAppend 		= Math.round(-50+$percentageScrolled);
		if($percentToAppend >= -50 && $percentToAppend <= 0) {
			$heroFilter.style.bottom 	= $percentToAppend+'%';
		}
	}

	/* Fade Detection For Content/Images */
	updateInView($scrollY);	

});

var $form 		= document.getElementById('form-contact');
var $formItems 	= document.querySelectorAll('.contact-group input, .contact-group textarea');
var $inpSubmit 	= document.querySelector('.contact-group input[type=submit]');
var $formMsg	= document.querySelector('.form-message');
var $formLoader	= document.querySelector('.form-loader');

/* Moving Labels Per Input */
$formItems.forEach(function($formItem){
	$formItem.addEventListener('input', function(e){
		if ($formItem.value.length == 0) {
			this.nextElementSibling.classList.remove('has-value');
		} else {
			$formMsg.innerHTML = "";
			this.nextElementSibling.classList.add('has-value');
		}
	});
});
/* Ajax posting to form with jQuery because it's easier :) */
$(document).ready(function(){
	$form.addEventListener('submit',function(event){
		var $dataToSend = [];
		var $stopProcessing = false;
		$formItems.forEach(function($formItem){
			if ($formItem.value.length == 0) {
				event.preventDefault();
				$formMsg.innerHTML = "Please fill out all of the fields!";
				var $stopProcessing = true;
			}
			$dataToSend.push($formItem.value);
		});
		if (!$stopProcessing) {
			var $url 	= "src/submit.php";
			var $dataToExplode = $dataToSend.join('||');
			$.post($url, {
				data: $dataToExplode
			}).done(function(data){
				$formMsg.innerHTML = "Thanks for your message! I'll be in touch as soon as I can.";
			    alert("Data Loaded: " + data);
			    $form.reset();
			});			
		}

	});//submit
});//jquery

/* Tabbing through sections */
$mainNavLinks.forEach(function($navItem){
	$navItem.addEventListener('click',function(e){
		e.preventDefault();
		/* Removing Current Slide */
		var $currentView = document.querySelector('.content-section.active');
		var $currentNavItem = document.querySelector('.anchNav.active');
		if ($currentView) {
			$currentNavItem.classList.remove('active');
			$currentView.classList.remove(...$tabClassListVisible);
			$currentView.classList.add(...$tabClassList);
		}
		var $sectionID 	= $navItem.getAttribute('data-view-id');
		var $thisView	= document.querySelector('section[data-view-id="'+$sectionID+'"]');
		if ($thisView) {
			this.classList.add('active');
			$heroInner.innerHTML = "<h2>"+this.innerHTML+"</h2>";
			$thisView.classList.remove(...$tabClassList);
			$thisView.classList.add(...$tabClassListVisible); // add or remove multiple classes using spread syntax ...array
			var $generatedSpan 			= document.querySelectorAll('.shape-area > span');
			$generatedSpan.forEach(function(span){
				span.style.opacity = '0';
			});
			setTimeout(function(e){
				createNewShapes();
			},280);
			// if (!$navItem.classList.contains('work')) {
			// 	var $thisViewOffset = offset($thisView);
			// 	window.scroll({
			// 		top: $thisViewOffset.top - $10vh/2.5,
			// 		behavior:'smooth'
			// 	});
			// }
		}
		return false;
	});
});

/* Hero section mouse detection */
$heroArea.addEventListener('mousemove',function(e){
	$heroInner.style.left = (-e.clientX/55).toFixed(2)+'px';
	$heroInner.style.top = (-e.clientY/55).toFixed(2)+'px';
});

/* Reset back to center when mouse leaves window */
document.body.addEventListener('mouseout',function(e){
	if (!e.relatedTarget && !e.toElement) {
		$heroInner.style.left = '0px';
		$heroInner.style.top = '0px';	
	}
});

/* Hero section shapes */
var $shapeAreas 			= document.querySelectorAll('.shape-area');
var $generatedSpan 		= document.querySelectorAll('.shape-area > span');	
var $spanShapeClass 	= ['rectangle','triangle','circle','bar','parallelogram'];
var $spanShapeColors  	= [
'rgba(0, 38, 58, 1)',
'rgba(40, 0, 20, 1)',
'rgba(117, 24, 24, 1)',
'rgba(173,33,33,1)',
'rgba(255, 107, 12,1)',
'rgba(255, 141, 12,1)'
];
/* $spanShapeColors from style.scss */
// $red: rgba(0, 38, 58, 1);
// $blue: rgba(0, 38, 58, 1);
// $purple: rgba(40, 0, 20, 1);
// $red: rgba(117, 24, 24, 1);
// $lightred:	rgba(173,33,33,1);
// $orange: rgba(255, 107, 12,1);
// $lightorange: rgba(255, 141, 12,1);
function createNewShapes(){
	var $generatedSpan 			= document.querySelectorAll('.shape-area > span');	
	if ($generatedSpan){
		//we have a list already, so remove first.
		//opacity is already set to 0 from menu click
		$generatedSpan.forEach(function(span){
			span.parentNode.removeChild(span);
		});
	}
	var $numberOfShapes = Math.floor(Math.random()*5)+1;
	for(i = 0; i <= $numberOfShapes; i++) {
		$shapeAreas.forEach(function(shapeArea){
			var $thisSpan = document.createElement('span');
			shapeArea.appendChild($thisSpan);
		});
	}
	//reselecting new spans
	var $generatedSpanNew 	= document.querySelectorAll('.shape-area > span');	
	$generatedSpanNew.forEach(function(span){
		var $shapeIndex = Math.floor(Math.random() * $spanShapeClass.length);
		var $colorIndex = Math.floor(Math.random() * $spanShapeColors.length);
		var $degIndex 	= Math.floor(Math.random() * 360);
		span.classList.add($spanShapeClass[$shapeIndex]);
		span.style.backgroundColor = $spanShapeColors[$colorIndex];
		var $randomLeft			= Math.floor(Math.random()*($wh[0] - $20vw + 1)) + $10vw;
		var $randomTop			= Math.floor(Math.random()*($wh[1] - $20vh + 1)) + $10vh;	
		span.style.left = $randomLeft+'px';
		span.style.top 	= $randomTop+'px';
		span.style.transform 	= 'rotate('+$degIndex+'deg)';
		if ($spanShapeClass[$shapeIndex] == 'triangle') {
			span.style.backgroundColor = 'transparent';
			span.style.borderBottomColor = $spanShapeColors[$colorIndex];
		}
		setTimeout(function(e){
			span.style.opacity = '0.8';
		},280);
	});	
}

createNewShapes();

/* Image Backdrop Colors */
var $imageBackgrounds = document.querySelectorAll('.image-after');
$imageBackgrounds.forEach(function(image){
	var $colorIndex = Math.floor(Math.random() * $spanShapeColors.length);
	image.style.backgroundColor = $spanShapeColors[$colorIndex];
});


/* Name Selector Easter Egg */
var $nameSelector = document.querySelector('.anch-name-selector');
var $nameSelectorView = document.querySelector('.name-selector-view');
var $namesToAppend = "";

const $names = [
"Robert","Robby","Roberto","Robe",
"Trobert","Trobby","Trobathin","Troberto","Trobe","Trizzy",
"Trout","Bob Chuck","Trobdor","Voltorb","T-Bone","Bonecrusher", "Robbie Chaz",
"Rabbit","Robbay","Trombone","Trobbly Wobbly"
];

$names.forEach(function(name){
	$namesToAppend 	+=  '<span class="select-name col col-md-4">'+name+'</span>';
	$nameSelectorView.innerHTML = '<div class="col-12"><h4 class="names-alt">Alternate Names</h4><i class="fa fa-2x fa-times btn-close-selector-view"></i></div>' + $namesToAppend;
})

var $selectableNames = document.querySelectorAll('.select-name');
$selectableNames.forEach(function(name){
	name.addEventListener('click',function(){
		$nameSelector.innerHTML = this.innerHTML;
	});
});

/* 	Closing pop-up when clicking away from $nameSelector
	$btnCloseSelectorView must be below the $names.forEach
 */
var $btnCloseSelectorView = document.querySelector('.btn-close-selector-view');
$btnCloseSelectorView.addEventListener('click',function(){
	$nameSelectorView.classList.remove('visible','open');
});

$nameSelector.addEventListener('click',function(e){
	e.preventDefault();
	if ($nameSelectorView.classList.contains('open')) {
		$nameSelectorView.classList.remove('visible','open');
	} else {
		$nameSelectorView.classList.add('visible','open');
	}
});




