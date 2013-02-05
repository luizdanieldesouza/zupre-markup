// iepp v2.1pre @jon_neal & @aFarkas github.com/aFarkas/iepp
// html5shiv @rem remysharp.com/html5-enabling-script
// Dual licensed under the MIT or GPL Version 2 licenses
/*@cc_on(function(a,b){function r(a){var b=-1;while(++b<f)a.createElement(e[b])}if(!window.attachEvent||!b.createStyleSheet||!function(){var a=document.createElement("div");return a.innerHTML="<elem></elem>",a.childNodes.length!==1}())return;a.iepp=a.iepp||{};var c=a.iepp,d=c.html5elements||"abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|subline|summary|time|video",e=d.split("|"),f=e.length,g=new RegExp("(^|\\s)("+d+")","gi"),h=new RegExp("<(/*)("+d+")","gi"),i=/^\s*[\{\}]\s*$/,j=new RegExp("(^|[^\\n]*?\\s)("+d+")([^\\n]*)({[\\n\\w\\W]*?})","gi"),k=b.createDocumentFragment(),l=b.documentElement,m=b.getElementsByTagName("script")[0].parentNode,n=b.createElement("body"),o=b.createElement("style"),p=/print|all/,q;c.getCSS=function(a,b){try{if(a+""===undefined)return""}catch(d){return""}var e=-1,f=a.length,g,h=[];while(++e<f){g=a[e];if(g.disabled)continue;b=g.media||b,p.test(b)&&h.push(c.getCSS(g.imports,b),g.cssText),b="all"}return h.join("")},c.parseCSS=function(a){var b=[],c;while((c=j.exec(a))!=null)b.push(((i.exec(c[1])?"\n":c[1])+c[2]+c[3]).replace(g,"$1.iepp-$2")+c[4]);return b.join("\n")},c.writeHTML=function(){var a=-1;q=q||b.body;while(++a<f){var c=b.getElementsByTagName(e[a]),d=c.length,g=-1;while(++g<d)c[g].className.indexOf("iepp-")<0&&(c[g].className+=" iepp-"+e[a])}k.appendChild(q),l.appendChild(n),n.className=q.className,n.id=q.id,n.innerHTML=q.innerHTML.replace(h,"<$1font")},c._beforePrint=function(){if(c.disablePP)return;o.styleSheet.cssText=c.parseCSS(c.getCSS(b.styleSheets,"all")),c.writeHTML()},c.restoreHTML=function(){if(c.disablePP)return;n.swapNode(q)},c._afterPrint=function(){c.restoreHTML(),o.styleSheet.cssText=""},r(b),r(k);if(c.disablePP)return;m.insertBefore(o,m.firstChild),o.media="print",o.className="iepp-printshim",a.attachEvent("onbeforeprint",c._beforePrint),a.attachEvent("onafterprint",c._afterPrint)})(this,document)@*/
$(function(){
	initialize();
	function initialize() {
		if ($('#google-map').length) {
			var latlng = new google.maps.LatLng(55.797171042593654, 37.58219046032711);
			var myOptions = {
				zoom: 14,
				center: latlng,
				mapTypeControl: true,
				mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
				navigationControl: true,
				navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			var map = new google.maps.Map(document.getElementById("google-map"), myOptions);
			var companyImage = new google.maps.MarkerImage('images/ico-map-point.png',new google.maps.Size(32,31),new google.maps.Point(0,0),new google.maps.Point(19,14));
			var companyPos = new google.maps.LatLng(55.797171042593654, 37.58109016032711);
			var companyMarker = new google.maps.Marker({
				position: companyPos,
				map: map,
				icon: companyImage,
				zIndex: 3
			});
		}
	}
	mapTabs();
	initPlugins();
	initSlider();
	openFilterDrop();
	openPopups();
	$('.lightbox .gallery .more').click(function(e){
		window.open($(this).attr('href'));
		e.preventDefault();
	});
	ajaxSchedule();

	function ajaxSchedule(){
		var form = $('.main-filter form');
		if(!form.length) return;
		var btnSubmit = form.find('input:submit'),
			btnSuccess = form.find('.btn-success'),
			url = form.attr('action');
		form.submit(function(e){e.preventDefault();});
		btnSuccess.click(function(e){
			setTimeout(function(){
				sendRequest(form.serialize() , form.attr('method'));
			},100,true);
			e.preventDefault();
		});
		function sendRequest(data , method){
			data += '&time=' + $('.main-filter .filter-list .bg[data-default-second-time]').text().replace(/\s+/g, '');
			if(!url || url == '' || url == '#'){
				alert('url = ' + url + '     data = ' + data);
				return;
			}
			$.ajax({
				url:url,
				type:method,
				data:data,
				dataType:'html',
				success:function(){},
				error:function(){
					alert('an AJAX error occured!');
				}
			});
		}
	}

	function openFilterDrop(){
		var box = $('.main-filter .filter-box'),
			activeClass = 'active' , temp = [] , filterList = $() , t,
			defaultClass = 'checkboxArea', checkedClass = 'checkboxAreaChecked';
		box.each(function(){
			var cur = $(this),
				opener = cur.find('.opener , .filter-list li a'),
				closeBtn = cur.find('.btn-success'),
				drop = cur.find('.drop');
			opener.die('click');
			opener.live('click',function(e){
				if(cur.hasClass(activeClass)) cur.removeClass(activeClass);
				else{
					box.removeClass(activeClass);
					cur.addClass(activeClass);
				}
				e.preventDefault();
			});
			closeBtn.die('click');
			closeBtn.live('click',function(e){
				temp = [];
				if(cur.find('.checkbox-list').length){
					filterList = cur.find('.filter-list');
					filterList.find('li:first .bg').text(cur.find('.checkbox-list input:checkbox[checked=checked]').eq(0).parent().find('label').text());
					cur.find('.checkbox-list input:checkbox[checked=checked]').each(function(){temp.push($(this).parent().find('label').text());});
					filterList.find('>li').not(':first').remove();
					if(temp.length + 1 == cur.find('.checkbox-list > li').length){
						t = cur.find('.checkbox-list > li .' + defaultClass);
						cur.find('.checkbox-list > li .' + checkedClass).removeClass(checkedClass).addClass(defaultClass).parent().find('input:checkbox').removeAttr('checked');
						t.removeClass(defaultClass).addClass(checkedClass).parent().find('input:checkbox').attr('checked', 'checked');
						filterList.find('li:first .bg').text(cur.find('.checkbox-list input:checkbox[checked=checked]').parent().find('label').text());
					}
					else if(temp.length > 1) for(var i = 1; i < temp.length; i++){
						if($('.main-filter').hasClass('alt')) filterList.prepend('<li><span class="bg"><a href="#">' + temp[i] + ',' + '</a></span></li>');
						else filterList.append('<li><span class="bg"><a href="#">' + temp[i] + '</a></span></li>');
					};
				}
				else filterList = cur.find('.filter-list > li:first .bg').text(cur.find('.slide-range a:first span').text() + ' - ' + cur.find('.slide-range a:last span').text());
				cur.removeClass(activeClass);
				e.preventDefault();
			});
		});
		box.click(function(e){e.stopPropagation();});
		$('html').click(function(){box.removeClass(activeClass);});
	};

	function mapTabs(){
		var list = $('.contacts-section .map-type');
		if(!list.length) return;
		var items = list.find('>li'),
			links = items.find('a'),
			activeClass = 'active',
			flag = false,
			animSpeed = 400;
		if(items.filter('.' + activeClass).length > 1) items.removeClass(activeClass).eq(0).addClass(activeClass);
		var curLink = items.filter('.' + activeClass).find('a'),
			tabs = $();
		setTimeout(function(){
			links.each(function(){
				tabs = tabs.add($($(this).attr('href')).hide());
			});
			$(curLink.attr('href')).show();
		} , 500 , true);
		links.click(function(e){
			if(!flag && !$($(this).attr('href')).is(':visible')){
				var cur = $(this);
				flag = true;
				items.removeClass(activeClass);
				cur.parent().addClass(activeClass);
				$(curLink.attr('href')).fadeOut(animSpeed , function(){
					curLink = cur;
					$(curLink.attr('href')).fadeIn(animSpeed , function(){flag = false});
				});
			}
			e.preventDefault();
		});
	}

	function intToTime(value){
		var timeString = parseInt(value/100);
		if(timeString/10 < 1) timeString = '0' + timeString;
		if(value%100 == 50){timeString = timeString + ':30'}
		else{timeString = timeString + ':00'}
		return timeString;
	}

	function openPopups(){
		var items = $('.schedule-list ul li'),
			win = $(window);
		items.each(function(){
			var cur = $(this),
				links = cur.find('h3 a, .name a, .place span').not('.type');
			links.mouseenter(function(){
				cur.css({zIndex: 1});
				cur.parent().parent().css({zIndex: 1});
				cur.find($('.' + $(this).attr('data-popup'))).css({
					left: $(this).width() + 10,
					marginLeft: 0,
					top: $(this).parent().position().top
				}).show();
				if((win.width() - cur.find($('.' + $(this).attr('data-popup'))).offset().left) < cur.find($('.' + $(this).attr('data-popup'))).outerWidth(true)){
					cur.find($('.' + $(this).attr('data-popup'))).css({
						left: 0,
						marginLeft: -cur.find($('.' + $(this).attr('data-popup'))).outerWidth(true)
					});
				}
			}).mouseleave(function(){
				cur.find($('.' + $(this).attr('data-popup'))).hide();
				items.css({zIndex: 0});
				items.parent().parent().css({zIndex: 0});
			});
		});
		var items2 = $('.coaches-info-list > li .box');
		items2.each(function(){
			var cur = $(this),
				link = cur.find('.popup-link');
			link.mouseenter(function(){
				cur.find('.' + $(this).attr('data-popup')).show().css({
					top: '9px',
					left: '118px'
				});
				cur.css({zIndex: 1});
			}).mouseleave(function(){
				cur.find('.' + $(this).attr('data-popup')).hide();
				cur.css({zIndex: 0});
			});
		});
	};

	function initSlider(){
		$('.slide-range').each(function(){
			$(this).slider({
				range: true,
				min: 700,
				max: 2400,
				step: 50,
				values: [ parseInt($('.main-filter .filter-list .bg[data-default-first-time]').attr('data-default-first-time')) , parseInt($('.main-filter .filter-list .bg[data-default-second-time]').attr('data-default-second-time')) ],
				create: function( event, ui ){
					$(this).find('a').append('<span></span>');
				},
				slide: function( event, ui ){
					$(this).find('a:first span').text(intToTime(ui.values[0]));
					$(this).find('a:last span').text(intToTime(ui.values[1]));
				}
			});
			$(this).find('a:first span').text(intToTime($(this).slider('values' , 0)));
			$(this).find('a:last span').text(intToTime($(this).slider('values' , 1)));
			$('.main-filter .filter-list .bg[data-default-first-time]').text(intToTime($(this).slider('values' , 0)) + ' - ' + intToTime($(this).slider('values' , 1)));
		});
	};

	// form validation plugin
	$.fn.inputValidator = function(options){
		var options = $.extend({
			errorClass: 'error',
			successClass: 'success',
			filter: /^/,
			length: $(this).val()
		}, options);
		var _item = $(this);
		var _val = _item.val();
		if(_val.length < options.length || !options.filter.test(_val)){
			_item.addClass(options.errorClass);
			return false;
		}
		else {
			_item.removeClass(options.errorClass).addClass(options.successClass);
			return true;
		}
	}

	function validateForm(){
		var form = $('.lightbox-form');
		if(!form.length) return;
		form.each(function(){
			var cur = $(this),
				validate = true,
				items = cur.find('input:text, textarea').not('input:submit, #first-date, #second-date'),
				submit = cur.find('input:submit');
				submit.click(function(){
					items.each(function(){
						var filter = /^/,
							curItem = $(this);
						if(curItem.attr('id') == 'email') filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
						if(!curItem.inputValidator({
							filter: filter,
							length: 3
						})){
							curItem.parent().addClass('error');
							validate = false;
						}
						else curItem.parent().removeClass('error');
					});
					if(!validate) return false;
				});
		});
	}
	validateForm();
});

function initPlugins(){
	$('.checkbox-list input:checkbox').customCheckbox();
	$('.main-filter .scroll-holder').mCustomScrollbar();
	$('.main-filter').each(function(){
		if($(this).find('.filter-opener').length)
			$(this).OpenClose({
				opener:'.filter-opener',
				effect:'slide'
			});
	})
	$('.schedule-list .place .type[title] , .lightbox .gallery .more[title]').hoverTooltip({
		tooltipSelector: '.tooltip-text',
		extraOffsetX: 17,
		extraOffsetY: 0,
		attribute:'title'
	});
	
	$('.lightbox .gallery').fadeGallery({
		slideElements:'ul.slideset > li',
		pagerLinks:'.thumbnails li',
		btnNext:'.gallery-holder .btn-next',
		btnPrev:'.gallery-holder .btn-prev',
		activeClass:'selected',
		switchTime:3000,
		autoHeight: true,
		duration:650,
		IE:true
	});
	var _pagerLinks = '.about-gallery .gallery-list li';
	if($('.scheme-section .scheme-side ul li').length) _pagerLinks = '.scheme-section .scheme-side ul li';
	$('.lightbox .thumbnails').scrollGallery({
		mask: '.holder',
		slider: '>ul',
		slides: '>li',
		pagerLinks: _pagerLinks,
		pagerLinksOut: true
	});
	initLightbox();
	initDatepicker();
	$('.visual').fadeGallery({
		slideElements: 'ul.slideset > li',
		autoRotation: true,
		btnNext: '.switcher-holder a.btn-next',
		btnPrev: '.switcher-holder a.btn-prev',
		autoHeight: true,
		switchTime:3000,
		duration:650,
		IE: true
	});
};

function initDatepicker(){
	$.datepicker.setDefaults({
		closeText: 'Закрыть',
		prevText: '&#x3c;Пред',
		nextText: 'След&#x3e;',
		currentText: 'Сегодня',
		monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
		'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
		monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
		'Июл','Авг','Сен','Окт','Ноя','Дек'],
		dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
		dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
		dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
		weekHeader: 'Не',
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''
	});
	var itemsName = {
			firstDate: '#first-date',
			secondDate: '#second-date'
		},
		items = $(itemsName.firstDate + ','+ itemsName.secondDate),
		today = new Date(), diff = 0,
		disabledClass = 'disabled';
	items.each(function(){
		var cur = $(this);
		cur.datepicker({
			minDate: '+d',
			showOn: "both",
			buttonText: "Choose date",
			buttonImage: "images/ico-datepicker.png",
			buttonImageOnly: true,
			onSelect: function(string, uiObject){
				if('#' + uiObject.id == itemsName.firstDate){
					$(itemsName.secondDate).datepicker("option", "buttonImage", "images/ico-datepicker.png").parent().removeClass(disabledClass);
					diff = parseInt((Date.parse($(itemsName.firstDate).datepicker("getDate")) - Date.parse(today))/(1440*60*1000)) + 7;
					$(itemsName.secondDate).datepicker("setDate", '+'+ diff +'d');
					$(itemsName.secondDate).datepicker("option", "minDate", '+'+ diff +'d');
					$(itemsName.secondDate).datepicker("option", "maxDate", '+2m +'+ diff +'d');
				}
			}
		});
		if(cur.parent().hasClass('disabled')) cur.datepicker("option", "buttonImage", "images/ico-datepicker-disabled.png");
	});
	
}

/*
 * jQuery Carousel plugin
 */
;(function($){
	function ScrollGallery(options) {
		this.options = $.extend({
			mask: 'div.mask',
			slider: '>*',
			slides: '>*',
			activeClass:'active',
			disabledClass:'disabled',
			btnPrev: 'a.btn-prev',
			btnNext: 'a.btn-next',
			generatePagination: false,
			pagerList: '<ul>',
			pagerListItem: '<li><a href="#"></a></li>',
			pagerListItemText: 'a',
			pagerLinks: '.pagination li',
			currentNumber: 'span.current-num',
			totalNumber: 'span.total-num',
			circularRotation: true,
			disableWhileAnimating: false,
			autoRotation: false,
			pauseOnHover: true,
			maskAutoSize: false,
			switchTime: 4000,
			animSpeed: 600,
			event:'click',
			swipeGap: false,
			swipeThreshold: 50,
			handleTouch: true,
			vertical: false,
			step: false,
			pagerLinksOut: false
		}, options);
		this.init();
	}
	ScrollGallery.prototype = {
		init: function() {
			if(this.options.holder) {
				this.findElements();
				this.attachEvents();
				this.refreshState(true);
				this.autoRotate();
			}
		},
		findElements: function() {
			// define dimensions proporties
			this.fullSizeFunction = this.options.vertical ? 'outerHeight' : 'outerWidth';
			this.innerSizeFunction = this.options.vertical ? 'height' : 'width';
			this.slideSizeFunction = 'outerHeight';
			this.maskSizeProperty = 'height';
			this.animProperty = this.options.vertical ? 'marginTop' : 'marginLeft';
			
			// control elements
			this.gallery = $(this.options.holder);
			this.mask = this.gallery.find(this.options.mask);
			this.slider = this.mask.find(this.options.slider);
			this.slides = this.slider.find(this.options.slides);
			var summaryWidthSlides = 0;
			this.slides.each(function(){summaryWidthSlides += $(this).outerWidth(true);});
			this.slider.width(summaryWidthSlides);
			this.btnPrev = this.gallery.find(this.options.btnPrev);
			this.btnNext = this.gallery.find(this.options.btnNext);
			this.currentStep = 0; this.stepsCount = 0;
			
			// calculate offsets
			this.calculateOffsets();
			$(window).bind('resize orientationchange', $.proxy(this.onWindowResize, this));
			
			// create gallery pagination
			if(typeof this.options.generatePagination === 'string') {
				this.buildPagination();
			} else {
				this.pagerLinks = this.gallery.find(this.options.pagerLinks);
				if(this.options.pagerLinksOut) this.pagerLinks = $(this.options.pagerLinks);
				this.attachPaginationEvents();
			}
			
			// get start index
			var activeSlide = this.slides.filter('.'+this.options.activeClass);
			var activePagerLink = this.pagerLinks.filter('.'+this.options.activeClass);
			if(activeSlide.length) {
				this.currentStep = this.slides.index(activeSlide);
			} else if(activePagerLink.length) {
				this.currentStep = this.pagerLinks.index(activePagerLink);
			}
			this.prevIndex = this.currentStep;
			
			// misc elements
			this.curNum = this.gallery.find(this.options.currentNumber);
			this.allNum = this.gallery.find(this.options.totalNumber);
		},
		attachEvents: function() {
			this.btnPrev.bind(this.options.event, this.bindScope(function(e){
				this.prevSlide();
				e.preventDefault();
			}));
			this.btnNext.bind(this.options.event, this.bindScope(function(e){
				this.nextSlide();
				e.preventDefault();
			}));
			
			// pause on hover handling
			if(this.options.autoRotation && this.options.pauseOnHover) {
				this.gallery.hover(this.bindScope(function(){
					this.galleryHover = true;
					this.pauseRotation();
				}), this.bindScope(function(){
					this.galleryHover = false;
					this.resumeRotation();
				}));
			}
			
			// swipe event handling
			if(isTouchDevice) {
				// enable hardware acceleration
				this.slider.css({'-webkit-transform': 'translate3d(0px, 0px, 0px)'});
				
				// swipe gestures
				if(this.options.handleTouch && $.fn.swipe) {
					this.gallery.swipe({
						threshold: this.options.swipeThreshold,
						allowPageScroll: 'vertical',
						swipeStatus: $.proxy(function(e, phase, direction, distance) {
							if(phase === 'start') {
								this.originalOffset = parseInt(this.slider.stop().css(this.animProperty));
							} else if(phase === 'move') {
								if(direction === 'left' || direction === 'right') {
									var tmpOffset = this.originalOffset + distance * (direction === 'left' ? -1 : 1);
									if(!this.options.swipeGap) {
										tmpOffset = Math.max(Math.min(0, tmpOffset), this.maxOffset);
									}
									
									this.tmpProps = {};
									this.tmpProps[this.animProperty] = tmpOffset;
									this.slider.css(this.tmpProps);
								}
							} else if(phase === 'cancel') {
								// return to previous position
								this.switchSlide();
							}
						},this),
						swipe: $.proxy(function(event, direction) {
							if(direction === 'left') {
								if(this.currentStep === this.stepsCount - 1) this.switchSlide();
								else this.nextSlide();
							} else if(direction === 'right') {
								if(this.currentStep === 0) this.switchSlide();
								else this.prevSlide();
							}
						},this)
					});
				}
			}
		},
		onWindowResize: function() {
			this.calculateOffsets();
			this.refreshPosition();
			this.buildPagination();
			this.refreshState();
		},
		refreshPosition: function() {
			this.currentStep = Math.min(this.currentStep, this.stepsCount - 1);
			this.tmpProps = {};
			this.tmpProps[this.animProperty] = this.getStepOffset();
			this.slider.stop().css(this.tmpProps);
		},
		calculateOffsets: function() {
			this.maskSize = this.mask[this.innerSizeFunction]();
			this.sumSize = this.getSumSize();
			this.maxOffset = this.maskSize - this.sumSize;
			
			// vertical gallery with single size step custom behavior
			if(this.options.vertical && this.options.maskAutoSize) {
				this.options.step = 1;
				this.stepsCount = this.slides.length;
				this.stepOffsets = [0];
				var tmpOffset = 0;
				for(var i = 0; i < this.slides.length; i++) {
					tmpOffset -= $(this.slides[i])[this.fullSizeFunction](true);
					this.stepOffsets.push(tmpOffset);
				}
				this.maxOffset = tmpOffset;
				return;
			}
			
			// scroll by slide size
			if(typeof this.options.step === 'number' && this.options.step > 0) {
				this.slideDimensions = [];
				this.slides.each($.proxy(function(ind, obj){
					this.slideDimensions.push( $(obj)[this.fullSizeFunction](true) );
				},this));
				
				// calculate steps count
				this.stepOffsets = [0];
				this.stepsCount = 0;
				var tmpOffset = 0, tmpStep = 0;
				while(tmpOffset >= this.maxOffset) {
					tmpOffset -= this.getSlideSize(tmpStep, tmpStep + this.options.step);
					tmpStep += this.options.step;
					this.stepOffsets.push(Math.max(tmpOffset, this.maxOffset));
					this.stepsCount++;
				}
			}
			// scroll by mask size
			else {
				// define step size
				this.stepSize = this.maskSize;
				
				// calculate steps count
				this.stepsCount = 1;
				var tmpOffset = 0;
				while(tmpOffset > this.maxOffset) {
					tmpOffset -= this.stepSize;
					this.stepsCount++;
				}
			}
			var summaryWidthSlides = 0;
			this.slides.each(function(){summaryWidthSlides += $(this).outerWidth(true);});
			this.slider.width(summaryWidthSlides);
		},
		getSumSize: function() {
			var sum = 0;
			this.slides.each($.proxy(function(ind, obj){
				sum += $(obj)[this.fullSizeFunction](true);
			},this));
			return sum;
		},
		getStepOffset: function(step) {
			step = step || this.currentStep;
			if(typeof this.options.step === 'number') {
				return this.stepOffsets[this.currentStep];
			} else {
				return Math.max(-this.currentStep * this.stepSize, this.maxOffset);
			}
		},
		getSlideSize: function(i1, i2) {
			var sum = 0;
			for(var i = i1; i < Math.min(i2, this.slideDimensions.length); i++) {
				sum += this.slideDimensions[i];
			}
			return sum;
		},
		buildPagination: function() {
			this.pagerHolder = this.gallery.find(this.options.generatePagination).empty();
			this.pagerList = $(this.options.pagerList).appendTo(this.pagerHolder);
			for(var i = 0; i < this.stepsCount; i++) {
				$(this.options.pagerListItem).appendTo(this.pagerList).find(this.options.pagerListItemText).text(i+1);
			}
			this.pagerLinks = this.pagerList.children();
			this.attachPaginationEvents();
		},
		attachPaginationEvents: function() {
			this.pagerLinks.each(this.bindScope(function(ind, obj){
				$(obj).bind(this.options.event, this.bindScope(function(){

					this.numSlide(ind);
					return false;
				}));
			}));
		},
		prevSlide: function() {
			if(!(this.options.disableWhileAnimating && this.galleryAnimating)) {
				if(this.currentStep > 0) {
					this.currentStep--;
					this.switchSlide();
				} else if(this.options.circularRotation) {
					this.currentStep = this.stepsCount - 1;
					this.switchSlide();
				}
			}
		},
		nextSlide: function(fromAutoRotation) {
			if(!(this.options.disableWhileAnimating && this.galleryAnimating)) {
				if(this.currentStep < this.stepsCount - 1) {
					this.currentStep++;
					this.switchSlide();
				} else if(this.options.circularRotation || fromAutoRotation === true) {
					this.currentStep = 0;
					this.switchSlide();
				}
			}
		},
		numSlide: function(c) {
			if(this.currentStep != c) {
				this.currentStep = c;
				this.switchSlide();
			}
		},
		switchSlide: function() {
			this.galleryAnimating = true;
			this.tmpProps = {}
			if(this.slider.width() > this.mask.width()){
				this.tmpProps[this.animProperty] = this.getStepOffset();
				this.slider.stop().animate(this.tmpProps,{duration: this.options.animSpeed, complete: this.bindScope(function(){
					// animation complete
					this.autoRotate();
				})});
			}
			else this.slider.css({margin: '0 auto'});
			this.refreshState();
		},
		refreshState: function(initial) {
			this.slides.removeClass(this.options.activeClass).eq(this.currentStep).addClass(this.options.activeClass);
			this.pagerLinks.removeClass(this.options.activeClass).eq(this.currentStep).addClass(this.options.activeClass);
			this.curNum.html(this.currentStep+1);
			this.allNum.html(this.stepsCount);
			
			// initial refresh
			if(this.options.maskAutoSize && typeof this.options.step === 'number') {
				this.tmpProps = {};
				this.tmpProps[this.maskSizeProperty] = this.slides.eq(Math.min(this.currentStep,this.slides.length-1))[this.slideSizeFunction](true);
				this.mask.stop()[initial ? 'css' : 'animate'](this.tmpProps);
			}
			
			// disabled state
			if(!this.options.circularRotation) {
				this.btnPrev.add(this.btnNext).removeClass(this.options.disabledClass);
				if(this.currentStep === 0) this.btnPrev.addClass(this.options.disabledClass);
				if(this.currentStep === this.stepsCount - 1) this.btnNext.addClass(this.options.disabledClass);
			}
		},
		pauseRotation: function() {
			clearTimeout(this.timer);
		},
		resumeRotation: function() {
			this.autoRotate();
		},
		autoRotate: function() {
			clearTimeout(this.timer);
			if(this.options.autoRotation && !this.galleryHover) {
				this.timer = setTimeout(this.bindScope(function(){
					this.nextSlide(true);
				}), this.options.switchTime);
			}
		},
		bindScope: function(func, scope) {
			return $.proxy(func, scope || this);
		}
	}
	
	// detect device type
	var isTouchDevice = (function() {
		try {
			return ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
		} catch (e) {
			return false;
		}
	}());
	
	// jquery plugin
	$.fn.scrollGallery = function(opt){
		return this.each(function(){
			$(this).data('ScrollGallery', new ScrollGallery($.extend(opt,{holder:this})));
		});
	}
}(jQuery));

/*
 * touchSwipe - jQuery Plugin
 * http://plugins.jquery.com/project/touchSwipe
 * http://labs.skinkers.com/touchSwipe/
 *
 * Copyright (c) 2010 Matt Bryson (www.skinkers.com)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * $version: 1.2.5
 */
;(function(a){a.fn.swipe=function(c){if(!this){return false}var k={fingers:1,threshold:75,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,click:null,triggerOnTouchEnd:true,allowPageScroll:"auto"};var m="left";var l="right";var d="up";var s="down";var j="none";var u="horizontal";var q="vertical";var o="auto";var f="start";var i="move";var h="end";var n="cancel";var t="ontouchstart" in window,b=t?"touchstart":"mousedown",p=t?"touchmove":"mousemove",g=t?"touchend":"mouseup",r="touchcancel";var e="start";if(c.allowPageScroll==undefined&&(c.swipe!=undefined||c.swipeStatus!=undefined)){c.allowPageScroll=j}if(c){a.extend(k,c)}return this.each(function(){var D=this;var H=a(this);var E=null;var I=0;var x={x:0,y:0};var A={x:0,y:0};var K={x:0,y:0};function z(N){var M=t?N.touches[0]:N;e=f;if(t){I=N.touches.length}distance=0;direction=null;if(I==k.fingers||!t){x.x=A.x=M.pageX;x.y=A.y=M.pageY;if(k.swipeStatus){y(N,e)}}else{C(N)}D.addEventListener(p,J,false);D.addEventListener(g,L,false)}function J(N){if(e==h||e==n){return}var M=t?N.touches[0]:N;A.x=M.pageX;A.y=M.pageY;direction=v();if(t){I=N.touches.length}e=i;G(N,direction);if(I==k.fingers||!t){distance=B();if(k.swipeStatus){y(N,e,direction,distance)}if(!k.triggerOnTouchEnd){if(distance>=k.threshold){e=h;y(N,e);C(N)}}}else{e=n;y(N,e);C(N)}}function L(M){M.preventDefault();distance=B();direction=v();if(k.triggerOnTouchEnd){e=h;if((I==k.fingers||!t)&&A.x!=0){if(distance>=k.threshold){y(M,e);C(M)}else{e=n;y(M,e);C(M)}}else{e=n;y(M,e);C(M)}}else{if(e==i){e=n;y(M,e);C(M)}}D.removeEventListener(p,J,false);D.removeEventListener(g,L,false)}function C(M){I=0;x.x=0;x.y=0;A.x=0;A.y=0;K.x=0;K.y=0}function y(N,M){if(k.swipeStatus){k.swipeStatus.call(H,N,M,direction||null,distance||0)}if(M==n){if(k.click&&(I==1||!t)&&(isNaN(distance)||distance==0)){k.click.call(H,N,N.target)}}if(M==h){if(k.swipe){k.swipe.call(H,N,direction,distance)}switch(direction){case m:if(k.swipeLeft){k.swipeLeft.call(H,N,direction,distance)}break;case l:if(k.swipeRight){k.swipeRight.call(H,N,direction,distance)}break;case d:if(k.swipeUp){k.swipeUp.call(H,N,direction,distance)}break;case s:if(k.swipeDown){k.swipeDown.call(H,N,direction,distance)}break}}}function G(M,N){if(k.allowPageScroll==j){M.preventDefault()}else{var O=k.allowPageScroll==o;switch(N){case m:if((k.swipeLeft&&O)||(!O&&k.allowPageScroll!=u)){M.preventDefault()}break;case l:if((k.swipeRight&&O)||(!O&&k.allowPageScroll!=u)){M.preventDefault()}break;case d:if((k.swipeUp&&O)||(!O&&k.allowPageScroll!=q)){M.preventDefault()}break;case s:if((k.swipeDown&&O)||(!O&&k.allowPageScroll!=q)){M.preventDefault()}break}}}function B(){return Math.round(Math.sqrt(Math.pow(A.x-x.x,2)+Math.pow(A.y-x.y,2)))}function w(){var P=x.x-A.x;var O=A.y-x.y;var M=Math.atan2(O,P);var N=Math.round(M*180/Math.PI);if(N<0){N=360-Math.abs(N)}return N}function v(){var M=w();if((M<=45)&&(M>=0)){return m}else{if((M<=360)&&(M>=315)){return m}else{if((M>=135)&&(M<=225)){return l}else{if((M>45)&&(M<135)){return s}else{return d}}}}}try{this.addEventListener(b,z,false);this.addEventListener(r,C)}catch(F){}})}})(jQuery);

// slideshow plugin
jQuery.fn.fadeGallery = function(_options){
	var _options = jQuery.extend({
		slideElements:'div.slideset > div',
		pagerLinks:'div.pager a',
		btnNext:'a.btn-next',
		btnPrev:'a.btn-prev',
		btnPlayPause:'a.play-pause',
		btnPlay:'a.play',
		btnPause:'a.pause',
		pausedClass:'paused',
		disabledClass: 'disabled',
		playClass:'playing',
		activeClass:'active',
		currentNum:false,
		allNum:false,
		startSlide:null,
		noCircle:false,
		pauseOnHover:true,
		autoRotation:false,
		autoHeight:false,
		onChange:false,
		switchTime:3000,
		duration:650,
		event:'click',
		IE:false
	},_options);

	return this.each(function(){
		// gallery options
		var _this = jQuery(this);
		var _slides = jQuery(_options.slideElements, _this);
		var _pagerLinks = jQuery(_options.pagerLinks, _this);
		var _btnPrev = jQuery(_options.btnPrev, _this);
		var _btnNext = jQuery(_options.btnNext, _this);
		var _btnPlayPause = jQuery(_options.btnPlayPause, _this);
		var _btnPause = jQuery(_options.btnPause, _this);
		var _btnPlay = jQuery(_options.btnPlay, _this);
		var _pauseOnHover = _options.pauseOnHover;
		var _autoRotation = _options.autoRotation;
		var _activeClass = _options.activeClass;
		var _disabledClass = _options.disabledClass;
		var _pausedClass = _options.pausedClass;
		var _playClass = _options.playClass;
		var _autoHeight = _options.autoHeight;
		var _duration = _options.duration;
		if (_options.IE && $.browser.msie) {
			if ($.browser.version < 9) _duration = 0;
		}
		var _switchTime = _options.switchTime;
		var _controlEvent = _options.event;
		var _currentNum = (_options.currentNum ? jQuery(_options.currentNum, _this) : false);
		var _allNum = (_options.allNum ? jQuery(_options.allNum, _this) : false);
		var _startSlide = _options.startSlide;
		var _noCycle = _options.noCircle;
		var _onChange = _options.onChange;

		// gallery init
		var _hover = false;
		var _prevIndex = 0;
		var _currentIndex = 0;
		var _slideCount = _slides.length;
		var _timer;
		if(_slideCount < 2) return;

		_prevIndex = _slides.index(_slides.filter('.'+_activeClass));
		if(_prevIndex < 0) _prevIndex = _currentIndex = 0;
		else _currentIndex = _prevIndex;
		if(_startSlide != null) {
			if(_startSlide == 'random') _prevIndex = _currentIndex = Math.floor(Math.random()*_slideCount);
			else _prevIndex = _currentIndex = parseInt(_startSlide);
		}
		_slides.hide().eq(_currentIndex).show();
		if(_autoRotation) _this.removeClass(_pausedClass).addClass(_playClass);
		else _this.removeClass(_playClass).addClass(_pausedClass);

		// gallery control
		if(_btnPrev.length) {
			_btnPrev.bind(_controlEvent,function(){
				prevSlide();
				return false;
			});
		}
		if(_btnNext.length) {
			_btnNext.bind(_controlEvent,function(){
				nextSlide();
				return false;
			});
		}
		if($('.about-gallery .gallery-list li, .scheme-section .scheme-side ul li').length){
			$('.about-gallery .gallery-list li, .scheme-section .scheme-side ul li').each(function(_ind){
				$(this).bind(_controlEvent,function(){
					if(_currentIndex != _ind) {
						_prevIndex = _currentIndex;
						_currentIndex = _ind;
						_slides.eq(_currentIndex).show();
						switchSlide();
					}
					return false;
				});
			});
		}
		if(_pagerLinks.length) {
			_pagerLinks.each(function(_ind){
				$(this).bind(_controlEvent,function(){
					if(_currentIndex != _ind) {
						_prevIndex = _currentIndex;
						_currentIndex = _ind;
						switchSlide();
					}
					return false;
				});
			});
		}

		// play pause section
		if(_btnPlayPause.length) {
			_btnPlayPause.bind(_controlEvent,function(){
				if(_this.hasClass(_pausedClass)) {
					_this.removeClass(_pausedClass).addClass(_playClass);
					_autoRotation = true;
					autoSlide();
				} else {
					_autoRotation = false;
					if(_timer) clearTimeout(_timer);
					_this.removeClass(_playClass).addClass(_pausedClass);
				}
				return false;
			});
		}
		if(_btnPlay.length) {
			_btnPlay.bind(_controlEvent,function(){
				_this.removeClass(_pausedClass).addClass(_playClass);
				_autoRotation = true;
				autoSlide();
				return false;
			});
		}
		if(_btnPause.length) {
			_btnPause.bind(_controlEvent,function(){
				_autoRotation = false;
				if(_timer) clearTimeout(_timer);
				_this.removeClass(_playClass).addClass(_pausedClass);
				return false;
			});
		}
		if(_autoHeight) _slides.eq(_currentIndex).parent().animate({height:_slides.eq(_currentIndex).show().outerHeight(true)},{duration:_duration,queue:false});
		autoSlide();
		// gallery animation
		function prevSlide() {
			_prevIndex = _currentIndex;
			if(_currentIndex > 0) _currentIndex--;
			else {
				if(_noCycle) return;
				else _currentIndex = _slideCount-1;
			}
			switchSlide();
		}
		function nextSlide() {
			_prevIndex = _currentIndex;
			if(_currentIndex < _slideCount-1) _currentIndex++;
			else {
				if(_noCycle) return;
				else _currentIndex = 0;
			}
			switchSlide();
		}
		function refreshStatus() {
			if(_pagerLinks.length) _pagerLinks.removeClass(_activeClass).eq(_currentIndex).addClass(_activeClass);
			if(_currentNum) _currentNum.text(_currentIndex+1);
			if(_allNum) _allNum.text(_slideCount);
			_slides.eq(_prevIndex).removeClass(_activeClass);
			_slides.eq(_currentIndex).addClass(_activeClass);
			if(_noCycle) {
				if(_btnPrev.length) {
					if(_currentIndex == 0) _btnPrev.addClass(_disabledClass);
					else _btnPrev.removeClass(_disabledClass);
				}
				if(_btnNext.length) {
					if(_currentIndex == _slideCount-1) _btnNext.addClass(_disabledClass);
					else _btnNext.removeClass(_disabledClass);
				}
			}
			if(typeof _onChange === 'function') {
				_onChange(_this, _currentIndex);
			}
		}
		function switchSlide() {
			_slides.eq(_prevIndex).fadeOut(_duration);
			if(_autoHeight) _slides.eq(_currentIndex).parent().animate({height:_slides.eq(_currentIndex).show().outerHeight(true)},{duration:_duration,queue:false});
			_slides.eq(_currentIndex).hide().fadeIn(_duration);
			refreshStatus();
			autoSlide();
		}

		// autoslide function
		function autoSlide() {
			if(!_autoRotation || _hover) return;
			if(_timer) clearTimeout(_timer);
			_timer = setTimeout(nextSlide,_switchTime+_duration);
		}
		if(_pauseOnHover) {
			_this.hover(function(){
				_hover = true;
				if(_timer) clearTimeout(_timer);
			},function(){
				_hover = false;
				autoSlide();
			});
		}
		refreshStatus();
		jQuery(window).focus(function(){
			autoSlide();
			}).blur(function(){
			clearTimeout(_timer);
		});
	});
};

/*
 * jQuery Tooltip plugin
 */
;(function($){
	$.fn.hoverTooltip = function(o) {
		var options = $.extend({
			tooltipStructure: '<div class="custom-tooltip"><div class="tooltip-text"></div></div>',
			tooltipSelector: '.tooltip-text',
			positionTypeX: 'right',
			positionTypeY: 'bottom',
			attribute:'title',
			extraOffsetX: 10,
			extraOffsetY: 10,
			showOnTouchDevice: true
		},o);

		// create tooltip
		var tooltip = $('<div>').html(options.tooltipStructure).children().css({position:'absolute'});
		var tooltipTextBox = tooltip.find(options.tooltipSelector);
		var tooltipWidth, tooltipHeight;


		// tooltip logic
		function initTooltip(item) {
			var tooltipText = item.attr(options.attribute);
			item.removeAttr(options.attribute);
			if(isTouchDevice) {
				item.bind('touchstart', function(e) {
					showTooltip(item, tooltipText, getEvent(e));
					jQuery(document).one('touchend', hideTooltip);
				});
			} else {
				item.bind('mouseenter', function(e) {
					showTooltip(item, tooltipText, e);
				}).bind('mouseleave', hideTooltip).bind('mousemove', moveTooltip);
			}
		}
		function showTooltip(item, text, e) {
			tooltipTextBox.html(text);
			tooltip.appendTo(document.body).show();
			tooltipWidth = tooltip.outerWidth(true);
			tooltipHeight = tooltip.outerHeight(true);
			moveTooltip(e, item);
		}
		function hideTooltip() {tooltip.remove();}
		function moveTooltip(e) {;
			var top, left, x = e.pageX, y = e.pageY;

			switch(options.positionTypeY) {
				case 'top':
					top = y - tooltipHeight - options.extraOffsetY;
					break;
				case 'center':
					top = y - tooltipHeight / 2;
					break;
				case 'bottom':
					top = y + options.extraOffsetY;
					break;
			}

			switch(options.positionTypeX) {
				case 'left':
					left = x - tooltipWidth - options.extraOffsetX;
					break;
				case 'center':
					left = x - tooltipWidth / 2;
					break;
				case 'right':
					left = x + options.extraOffsetX;
					break;
			}

			tooltip.css({
				top: top,
				left: left 
			});
		}

		// add handlers
		//alert(isTouchDevice && !options.showOnTouchDevice);
		return this.each(function(){
			initTooltip($(this));
		});
	}

	// parse event
	function getEvent(e) {
		return e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
	}

	// detect device type
	var isTouchDevice = (function() {
		try {
			return ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
		} catch (e) {
			return false;
		}
	}());
}(jQuery));

$.fn.OpenClose = function(_options){
	// default options
	var _options = jQuery.extend({
		activeClass:'active',
		opener:'.opener',
		slider:'.slide',
		animSpeed: 400,
		animStart:false,
		animEnd:false,
		effect:'fade',
		event:'click'
	},_options);

	return this.each(function(){
		// options
		var _holder = jQuery(this);
		var _slideSpeed = _options.animSpeed;
		var _activeClass = _options.activeClass;
		var _opener = jQuery(_options.opener, _holder);
		var _slider = jQuery(_options.slider, _holder);
		var _animStart = _options.animStart;
		var _animEnd = _options.animEnd;
		var _effect = _options.effect;
		var _event = _options.event;
		var flag = false;
		if(_holder.attr('class') === _opener.attr('class')) flag = true;
		if(_slider.length) {
			if(flag) _holder.find('a , input').click(function(e){e.stopPropagation();});
			_opener.bind(_event,function(e){
				if(!_slider.is(':animated')) {
					if(typeof _animStart === 'function') _animStart();
					if(_holder.hasClass(_activeClass)) {
						_slider[_effect=='fade' ? 'fadeOut' : 'slideUp'](_slideSpeed, function(){
							_holder.removeClass(_activeClass);
							if(typeof _animEnd === 'function') _animEnd();
						});
					} else {
						_holder.addClass(_activeClass);
						_slider[_effect=='fade' ? 'fadeIn' : 'slideDown'](_slideSpeed, function(){
							if(typeof _animEnd === 'function') _animEnd();
						});
					}
				}
				e.preventDefault();
			});
			if(_holder.hasClass(_activeClass)) _slider.show();
			else _slider.hide();
		}
	});
}

/*--- custom checkbox's ---*/
jQuery.fn.customCheckbox = function(_options){
	var _options = jQuery.extend({
		checkboxStructure: '<div></div>',
		checkboxDisabled: 'disabled',
		checkboxDefault: 'checkboxArea',
		checkboxChecked: 'checkboxAreaChecked'
	}, _options);
	return this.each(function(){
		var checkbox = jQuery(this);
		if(!checkbox.hasClass('outtaHere') && checkbox.is(':checkbox')){
			var replaced = jQuery(_options.checkboxStructure);
			this._replaced = replaced;
			if(checkbox.is(':disabled')) replaced.addClass(_options.checkboxDisabled);
			else if(checkbox.is(':checked')) replaced.addClass(_options.checkboxChecked);
			else replaced.addClass(_options.checkboxDefault);

			replaced.click(function(){
				if(checkbox.is(':checked')) checkbox.removeAttr('checked');
				else checkbox.attr('checked', 'checked');
				changeCheckbox(checkbox);
				changeCheckboxAlt(checkbox);
			});
			checkbox.click(function(){
				changeCheckbox(checkbox);
				changeCheckboxAlt(checkbox);
			});
			replaced.insertBefore(checkbox);
			checkbox.addClass('outtaHere');
		}
	});
	function changeCheckbox(_this){
		if(_this.is(':checked')) _this.get(0)._replaced.removeClass().addClass(_options.checkboxChecked);
		else _this.get(0)._replaced.removeClass().addClass(_options.checkboxDefault);
		if(typeof(_this.change) == 'function') _this.change();
		if(typeof(_this.get(0).onchange) == 'function') _this.get(0).onchange();
	}
	function changeCheckboxAlt(cur){
		var temp;
		if(cur.attr('data-add-option') == 'all') temp = $('input:checkbox[data-name=' + cur.attr('data-name') + ']').not(cur);
		else temp = $('input:checkbox[data-add-option=all][data-name=' + cur.attr('data-name') + ']');
		temp.removeAttr('checked').parent().find('.' + _options.checkboxChecked).removeClass(_options.checkboxChecked).addClass(_options.checkboxDefault);
	}
};

function initLightbox() {
	function a() {
		if (g) {
			var o = jQuery(window).height(),
				v = jQuery(window).width();
			g.outerWidth();
			var p = g.outerHeight(),
				r = j.height();
			f.width('100%');
			//v < l ? f.css("width", l) : f.css("width", "100%");
			o < r ? f.css("height", r) : f.css("height", o);
			g.css({
				position: "absolute",
				zIndex: e + 1
			});
			if (o > p) /*jQuery.browser.msie && jQuery.browser.version < 7 ? */g.css({
				position: "absolute",
				top: parseInt(jQuery(window).scrollTop()) + (o - p) / 2
			})/* : g.css({
				position: "fixed",
				top: (o - p) / 2
			});*/
			else {
				o = f.height();
				o < p && f.css("height", p);
				if (!m) if (o - p > parseInt(jQuery(window).scrollTop())) m = o = parseInt(jQuery(window).scrollTop());
				else m = o - p;
				g.css({
					position: "absolute",
					top: m
				})
			}
			f.width() > g.outerWidth() ? g.css({
				left: (f.width() - g.outerWidth()) / 2
			}) : g.css({
				left: 0
			})
		}
	}

	function b(o) {
		if (g) if (o) {
			f.fadeIn(h, function () {
				g.fadeIn(h)
			});
			m = false;
			a()
		} else g.fadeOut(h, function () {
			g.css({
				top: '-9999px',
				left: '-9999px'
			}).show();
			f.fadeOut(h);
			m = false
		})
	}

	function d(o) {
		if (!o.get(0).jsInit) {
			o.get(0).jsInit = true;	
			o.find(c).click(function () {
				g = o;
				b(false);
				return false
			})
		}
	}
	var e = 1E3,
		h = 500,
		c = "a.btn-close, a.close, a.cancel",
		f, g = null,
		i = jQuery("a.open-popup"),
		j = jQuery(document),
		l = jQuery("body > div:eq(0)").outerWidth(),
		m = false;
	f = jQuery("#lightbox-overlay");
	if (!f.length) {
		f = jQuery("<div />");
		f.attr("id", "lightbox-overlay");
		jQuery("body").append(f)
	}
	f.css({
		opacity: 0.65,
		backgroundColor: "#000",
		position: "absolute",
		overflow: "hidden",
		display: "none",
		top: 0,
		left: 0,
		zIndex: e
	});
	if (jQuery.browser.msie && jQuery.browser.version < 7) if (!f.children().length) {
		var k = jQuery('<iframe src="javascript:false" frameborder="0" scrolling="no" />');
		k.css({
			opacity: 0,
			width: "100%",
			height: "100%"
		});
		var s = jQuery("<div>");
		s.css({
			top: 0,
			left: 0,
			zIndex: 1,
			opacity: 0,
			background: "#595959",
			position: "absolute",
			width: "100%",
			height: "100%"
		});
		f.empty().append(k).append(s)
	}
	i.each(function () {
		var o = jQuery(this),
			v = o.attr("href");
		if (o.hasClass("ajax-load")) o.click(function () {
			if (jQuery('div[rel*="' + v + '"]').length == 0) jQuery.ajax({
				url: v,
				type: "POST",
				dataType: "html",
				success: function (r) {
					g = jQuery(r);
					g.find("img").load(a);
					g.attr("rel", v).hide().css({
						position: "absolute",
						zIndex: e + 1,
						top: -9999,
						left: -9999
					});
					jQuery("body").append(g);
					d(g);
					b(true)
				},
				error: function () {
					alert("AJAX error!");
					return false
				}
			});
			else {
				g = jQuery('div[rel*="' + v + '"]');
				b(true)
			}
			return false
		});
		else if (jQuery(v).length) {
			var p = jQuery(v);
			d(p);
			o.click(function (e) {
				if (g) g.fadeOut(h, function () {
					g = p.hide();
					b(true)
				});
				else {
					setTimeout(function(){
						g = p.hide();
						b(true)
					}, 100, true);
				}
				e.preventDefault();
			})
		}
	});
	jQuery(window).resize(a);
	jQuery(window).scroll(function(){if(f.is(':visible')) a;});
	jQuery(document).keydown(function (o) {
		if (!o) evt = window.event;
		o.keyCode == 27 && b(false)
	});
	f.click(function () {
		f.is(":animated") || b(false);
		return false
	})
}