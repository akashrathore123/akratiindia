var bannerboy = bannerboy || {};
bannerboy.main = function() {

	var width = 728;
	var height = 90;
	var banner = bannerboy.createElement({id: "banner", width: width, height: height, backgroundColor: "#fff", overflow: "hidden", cursor: "pointer", parent: document.body});
	var border = bannerboy.createElement({width: "100%", height: "100%", border: "1px solid #000", boxSizing: "border-box", zIndex: 10, parent: banner});
	var main_tl = new BBTimeline();

	var images = [	
		"illustration_master.png", 
		"document_blue.png", 
		"ladder_white.png", 
		"hand_white.png", 
		"wheelbarrow_white.png", 
		"txt_1.png",
		"txt_2.png",
		"txt_3.png",
		"logo.png", 
		"icon_gmail.png", 
		"icon_documents.png", 
		"icon_gdrive.png", 
		"icon_calendar.png", 
		"logo_gsuite_big.png", 
		"cta_txt.png", 
	];
	
	bannerboy.preloadImages(images, function() {

		/* Create elements
		================================================= */

		var illustration = bannerboy.createElement({scale:.85, left: 390, top: -15, width: 159, height: 120, parent: banner});
			var illustration_master = bannerboy.createElement({backgroundImage: "illustration_master.png", retina: true, parent: illustration});
			var document_blue = bannerboy.createElement({backgroundImage: "document_blue.png", left: 21, top: 47, retina: true, parent: illustration});
			var ladder_white = bannerboy.createElement({backgroundImage: "ladder_white.png", left: 120, top: 52, retina: true, parent: illustration});
			var hand_white = bannerboy.createElement({backgroundImage: "hand_white.png", left: 35, top: 66, retina: true, parent: illustration});
			var wheelbarrow_white = bannerboy.createElement({backgroundImage: "wheelbarrow_white.png", left: 4, top: 75, retina: true, parent: illustration});
		var txt_1 = bannerboy.createElement({backgroundImage: "txt_1.png", left: 170, top: 24, retina: true, parent: banner});
		var txt_2 = bannerboy.createElement({backgroundImage: "txt_2.png", left: 170, top: 24, retina: true, parent: banner});
		var lockup_container = bannerboy.createElement({left: 31, top: 46, width: 118, height: 26, parent: banner});
			var icon_gmail = bannerboy.createElement({backgroundImage: "icon_gmail.png", left: 0, top: 6, retina: true, parent: lockup_container});
			var icon_documents = bannerboy.createElement({backgroundImage: "icon_documents.png", left: 27, top:3, retina: true, parent: lockup_container});
			var icon_gdrive = bannerboy.createElement({backgroundImage: "icon_gdrive.png", left: 46, top: 3, retina: true, parent: lockup_container});
			var icon_calendar = bannerboy.createElement({backgroundImage: "icon_calendar.png", left: 70, top: 3, retina: true, parent: lockup_container});
			var logo_gsuite = bannerboy.createElement({backgroundImage: "logo.png", left: 552, top: -12, retina: true, parent: lockup_container});
		var logo_gsuite_big = bannerboy.createElement({backgroundImage: "logo_gsuite_big.png", left: 34, top: 22, retina: true, parent: banner});
		var cta = bannerboy.createElement({left: 443, top: 26, width: 129, height: 39, parent: banner});
			var cta_base = bannerboy.createElement({backgroundColor: "#4285f3", top:-1, left: -14, width: 100, height: 39, parent: cta});
			var cta_txt = bannerboy.createElement({backgroundImage: "cta_txt.png", left: 1, top: 13, retina: true, parent: cta});
			var txt_3 = bannerboy.createElement({backgroundImage: "txt_3.png", left: -265, top: -3, retina: true, parent: cta});

		/* Adjustments
		================================================= */

		cta_base.set({borderRadius: 2});
		document_blue.set({opacity: 0});

		/* Initiate
		================================================= */
		animations();
		timeline();
		interaction();
		/* Animations
		================================================= */

		function timeline() {
			main_tl 

			.offset(.25)
			.add(banner.lockupIn)
			.add(illustration.in)
			.offset(1)
			.add(textIn(txt_1))
			.offset(1)
			.add(whiteBlink(wheelbarrow_white))
			.offset(.7)
			.add(whiteBlink(ladder_white))
			.offset(.7)
			.add(whiteBlink(hand_white))
			.offset(.7)
			.add(document_blue.in)
			.offset(1)
			.add(textOut(txt_1))
			.offset(.3)
			.add(textIn(txt_2))
			.offset(4)
			.add(illustration.out)
			.offset(.75)
			.add(cta.in)
			.offset(3)
			.loop(1)

			scrubber(main_tl);
		}

		
			function textOut(txt, duration) {
			return new BBTimeline()
			.to(txt, duration || 0.3, {opacity: 0, ease: Power1.easeInOut});
		}
		function animations() {

			illustration.in = new BBTimeline()
			.from([illustration, logo_gsuite], 0.5, {opacity: 0});

			whiteBlink = function(obj) {
				return new BBTimeline()
				.to(obj, .3, {opacity: 0})
			}

			document_blue.in = new BBTimeline() 
			.to(document_blue, .2, {opacity: 1})
			
			textIn = function(txt) {
				return new BBTimeline()
				.from(txt, 0.5, {opacity: 0, ease: Power1.easeInOut});
			}

			illustration.out = new BBTimeline()
			.to([illustration, txt_2], 0.5, {opacity: 0});

			banner.lockupIn = new BBTimeline()
			.staggerFrom([icon_gmail, icon_documents, icon_gdrive, icon_calendar].reverse(), 1, {cycle: {x: function (i) { return -3 * bannerboy.utils.map((i+1), 1, 5, 5, 1); }}, ease: Power2.easeOut}, 0.2)
			.staggerFrom([icon_gmail, icon_documents, icon_gdrive, icon_calendar].reverse(), 0.3, {opacity: 0}, 0.2)
			.offset(0.5)
			.from(logo_gsuite_big, 1, {x: 3, opacity: 0});

			cta.in = new BBTimeline()
			.from(cta, 1, {opacity: 0, y: 0, ease: Power2.easeOut});

		}

		/* Interactions
		================================================= */
		function interaction() {
			// click logic goes here
			banner.onclick = function() {
				Enabler.exit("Clickthrough");
			};
		}

		/* Helpers
		================================================= */

		/* Scrubber
		================================================= */
		function scrubber(tl) {
			if (window.location.origin == "file://") {
				bannerboy.include(["../bannerboy_scrubber.min.js"], function() {
					if (bannerboy.scrubberController) bannerboy.scrubberController.create({"main timeline": tl});
				});
			}
		}
	});
};