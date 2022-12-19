$(function() {
	var headerHeight = $("#sideNav header").height();
	var buildHeight = $(".build").height();
	var buildCount = $(".build").length;
	var maxMenuHeight = $(window).height() - (headerHeight + (buildHeight * buildCount) + buildCount);



	init();



	$(window).load(function() {
		// Header Text sizing
		var sideNavWidth = $("#sideNav").css("width").substr(0, $("#sideNav").css("width").length - 2);
		var headerPadding = $("#sideNav header").css("padding-left").substr(0, $("#sideNav header").css("padding-left").length - 2);
		var maxTitleWidth = sideNavWidth - (headerPadding * 2);

		// Client title needs to shrink
		var titleWidth = $("h1").width();
		var titleStartingSize = $("h1").css("fontSize").substr(0, $("h1").css("fontSize").length - 2);
		if (titleWidth > maxTitleWidth) {

			while(titleWidth > maxTitleWidth) {
				titleStartingSize--;
				$("h1").css({
					"fontSize": titleStartingSize + "px",
					"lineHeight": (subTitleStartingSize / 2) + "px"
				});
				titleWidth = $("h1").width();
			}
		}

		// Job title needs to shrink
		var subTitleWidth = $("h2").width();
		var subTitleStartingSize = $("h2").css("fontSize").substr(0, $("h2").css("fontSize").length - 2);
		if (subTitleWidth > maxTitleWidth) {

			while(subTitleWidth > maxTitleWidth) {
				subTitleStartingSize--;
				$("h2").css({
					"fontSize": subTitleStartingSize + "px",
					"lineHeight": subTitleStartingSize + "px"
				});
				subTitleWidth = $("h2").width();
			}
		}

		// Center titles in sideNav header
		var headerHeight = $("#sideNav header").height();
		var headerCentering = (headerHeight - $(".header-container").height()) / 2;
		$(".header-container").css({
			"padding-top": headerCentering
		});

		// Make it visible now that everything's all good.
		$(".header-container").css({
			"visibility":"visible",
			"opacity":"1"
		});
	});

	$(window).resize(function() {
		maxMenuHeight = $(window).height() - (headerHeight + (buildHeight * buildCount) + buildCount);

		// Reset all heights
		$(".build-menu").each(function(i) {
			if ($(this).css("height") != "0px") {
				openMenu($(this));
			}
		});
	});



	// Click a banner build
	$("a .build-title").click(function(e) {
		e.preventDefault();

		// Close everything
		$(".build-title").removeClass("buildClicked");
		$(".build-titlePlus").removeClass("buildClicked-plus");
		$(".build-menu").css({"height": "0px"});

		// "Activate" button
		$(this).addClass("buildClicked");
		$(this).find(".build-titlePlus").addClass("buildClicked-plus");

		// Open menu
		$(".build-menu").css({"overflow-y": "hidden"});
		openMenu($(this));

		// Open ALL?
		if (e.shiftKey) {
			var allSizes = $(this).parent().parent().find(".build-menu a");

			// Activate all links
			$(".build-menu a").removeClass("sizeClicked");
			allSizes.toggleClass("sizeClicked");

			showAllAssets(allSizes, $(this).text());
		}
	});



	// Subgroup clicked
	$(".build-menu p").click(function(e) {
		if (e.shiftKey) {
			var allSizes = $(this).next().find("a");

			// Activate all links
			$(".build-menu a").removeClass("sizeClicked");
			allSizes.toggleClass("sizeClicked");

			showAllAssets(allSizes, $(this).text());
		}
	});



	// Size clicked
	$(".build-menu a").click(function(e) {
		e.preventDefault();

		if (e.shiftKey) {
			$(this).addClass("sizeClicked");

			showAsset($(this), true);
		} else {
			// Change text color to "clicked" state
			$(".build-menu a").removeClass("sizeClicked");
			$(this).toggleClass("sizeClicked");

			showAsset($(this));
		}
	});



	function init() {
		// Open first section
		$(".build-menu a:first").toggleClass("sizeClicked");			// Set first size to "clicked" state
		$(".build-title:first").addClass("buildClicked");				// Open first build
		$(".build-titlePlus:first").addClass("buildClicked-plus");		// Darken +
		openMenu($(".build-menu:first"));								// Open the sizes menu

		showAsset($(".build-menu a:first"));
	}


	function showAllAssets(aTags, subGroupTitle) {
		hideInfo();

		var bannerHTML = "";
		var oldBuild = "";

		for(var i = 0; i < aTags.length; i++) {
			// Banner data
			var bWidth = $(aTags[i]).data("width");
			var bHeight = $(aTags[i]).data("height");
			var bType = $(aTags[i]).data("type");
			var bLink = $(aTags[i]).attr("href");
			//var bTitle = $(aTags[i]).data("title");

			var currentBuild = $(aTags[i]).parent().parent().prev().text();

			// New build?
			if (oldBuild != currentBuild) {
				if (oldBuild != "") bannerHTML += "</div>";
				bannerHTML += "<div class='buildBlock'>" + currentBuild + "<br/>";
			}

			bannerHTML += "<div class='multi-banner'>";

			bannerHTML += getAssetHTML(bType, bWidth, bHeight, bLink);

			bannerHTML +=
			"<br/>" + currentBuild + " - " + bWidth + "x" + bHeight + "\
			</div>";
			//"<br/>" + bWidth + "x" + bHeight + "\

			oldBuild = currentBuild;
		}

		$("#bannerInfo").text(subGroupTitle);
		$("#bannerDisplay").html(bannerHTML);
	}


	function showAsset(aTag, multi) {
		hideInfo();

		// Load in first banner
		var bBuild = aTag.data("build");
		var bConcept = aTag.data("concept");
		var bWidth = aTag.data("width");
		var bHeight = aTag.data("height");
		var bType = aTag.data("type");
		var bLink = aTag.attr("href");

		if (multi) var bannerHTML = $("#bannerDisplay").html();
		else var bannerHTML = "";

		bannerHTML += getAssetHTML(bType, bWidth, bHeight, bLink);

		$("#bannerDisplay").html(bannerHTML);

		// Load in banner info
		if (!multi) {
			var bInfoString = aTag.data("title");
			$("#bannerInfo").text(bInfoString);
		} else {
			$("#bannerInfo").text("");
		}
	}



	function getAssetHTML(assetType, assetWidth, assetHeight, assetLink) {

		assetLink += "/index.html";
		var assetHTML = "";

		if (assetType == "swf") {
			// Is there a path?
			var swfPath = assetLink.split("/");
			var swfPathString = "";

			if (swfPath.length > 1) {

				for (var i = 0; i < swfPath.length-1; i++) {
					swfPathString += swfPath[i] + "/";
				}
			}

			var clickTagUrl = "http://projects.invisible.ink/clickTAG";
			clickTagUrl = encodeURIComponent(clickTagUrl);

			assetHTML +=
			"<object type='application/x-shockwave-flash' data='" + assetLink + "' width='" + assetWidth + "' height='" + assetHeight + "'>\
				<param name='movie' value='" + assetLink + "' />\
				<param name='quality' value='high'/>\
				<param name='bgcolor' value='#ededed' />\
				<param name='base' value='" + swfPathString + "' />\
				<param name='FlashVars' value='clickTAG="+clickTagUrl+"' />\
			</object>";
		} else if (assetType == "html") {
			var id = ("iframe-"+new Date().getTime() + "-" + Math.round(Math.random()*10000));
			assetHTML +=
			"<iframe id='"+id+"' src='" + assetLink + "' allowTransparency='true' seamless></iframe>";

			setTimeout(function() {
				$("#"+id).width(assetWidth + 50);
				$("#"+id).height(assetHeight + 50);
			}, 0);
		} else {
			assetLink += "?" + Math.random();
			assetHTML = "<img src='" + assetLink + "'' width='" + assetWidth + "' height='" + assetHeight + "' />";
		}

		return assetHTML;
	}



	function openMenu(obj) {
		// Set menu height
		var contentsHeight = obj.parents(".build").find(".build-menu")[0].scrollHeight;

		if (contentsHeight > maxMenuHeight) {
			obj.parents(".build").find(".build-menu").css({
				"height":maxMenuHeight + "px",
				"overflow-y": "auto"
			});
		}
		else {
			obj.parents(".build").find(".build-menu").css({
				"height": contentsHeight + "px",
				"overflow-y": "hidden"
			});
		}
	}


	var isShowingInfo = false;
	function showInfo() {
		isShowingInfo = true;
		$(document.body).addClass("show-info");
	}
	function hideInfo() {
		isShowingInfo = false;
		$(document.body).removeClass("show-info");
	}
	function toggleInfo() {
		if (isShowingInfo) {
			hideInfo();
		} else {
			showInfo();
		}
	}


	window.toggleInfo = function() {
		toggleInfo();
	};

});