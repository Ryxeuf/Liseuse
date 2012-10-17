document.addEventListener("deviceready", init, true);
var xml = "http://ryxeuf.fr/liseuse/catalogue.xml";
var chapitre = "";
var numpage=0;
var pagewidth=0;

$(document).bind('pageinit', function(){
	
	$("#index").on("pagebeforeshow", function(e){
		xml = "http://ryxeuf.fr/liseuse/catalogue.xml"
		$.ajax({
			beforeSend: function() { $.mobile.showPageLoadingMsg(); }, 
            complete: function() { $.mobile.hidePageLoadingMsg() },
			url: xml,
			dataType: "xml",
			async: false,
			success: function(xml) {
				$("#liste-manga").html("");
				$(xml).find("manga").each(function(){
					$("#liste-manga").append(
							$("<li>").append(
									$("<a>")
									.attr("href", "#page2")
									.attr("data-transition", "slide")
									.attr("url", $(this).find("url").text())
									.attr("class", "lienmanga")
									.text($(this).find("title").text())
							)
					);
				});
			}
		});
		$("#liste-manga").listview("refresh");
	});
	
	$("#page2").on("pagebeforeshow", function(event, ui){
		chapitre = "";
		numpage=0;
		$.ajax({
			beforeSend: function() { $.mobile.showPageLoadingMsg(); }, 
            complete: function() { $.mobile.hidePageLoadingMsg() },
			url: xml,
			dataType: "xml",
			async: false,
			success: function(xml) {
				$("#liste-chapitre").html("");
				$("#select-page").html("");
				$(xml).find("chapitre").each(function(){
					$("#liste-chapitre").append(
							$("<li>").append(
									$("<a>")
									.attr("href", "#page3")
									.attr("data-transition", "slide")
									.attr("numero", $(this).attr("numero"))
									.attr("class", "lienchapitre")
									.text($(this).find("titre").text())
							)
					);
					
				});
				$("#page2 div[data-role='header'] h1").html($(xml).find("name").text());
			},
			error: function(objRequest, jqxhr, settings, exception){
				if(event.handled !== true)
				{
					alert("Erreur de chargement du fichier XML du manga");
					$.mobile.changePage($("#index"));
					event.handled = true;
				}
				return false;
			}
		});
		$("#liste-chapitre").listview("refresh");
	});
	
	$("#page3").on("pagebeforeshow", function(event, ui){
		$.mobile.showPageLoadingMsg();
		if(event.handled !== true)
		{
			pagewidth = $(document).width();
			$.ajax({
				url: xml,
				dataType: "xml",
				async: false,
				success: function(xml) {
					$("#manga").html($(createVisu(xml)));
					event.stopImmediatePropagation();
				},
				error: function(objRequest, jqxhr, settings, exception){
					if(event.handled !== true)
					{
						alert("Erreur de chargement du fichier XML du manga");
						$.mobile.changePage($("#page2"));
						event.handled = true;
						event.stopImmediatePropagation();
					}
					return false;
				}
			});
			
			$("img").bind('touchmove', function(event) {
				if(event.originalEvent.touches.length == 5){
					var pouce = event.originalEvent.touches[0];
					var index = event.originalEvent.touches[1];
					var x = pouce.pageX - index.pageX;
					var y = pouce.pageY - index.pageY;
					$.mobile.changePage("#page4");
					var rapport = (x/pagewidth);
					var distance = rapport*pagewidth;
					var width = $(this).width()+distance;
					
					
//					console.log("ecran "+$(document).width());
					console.log("rapport "+rapport);
					console.log("width1 "+width);
					if(width < pagewidth)
						width = pagewidth;
					$(this).width(width);
					console.log("width2 "+width);
				}
//				for (var i = 0; i < event.originalEvent.targetTouches; i++) {
//					var touch = event.targetTouches[i];
//					console.log('touched ' + touch.identifier);
//				}
			});
			
			event.handled = true;
		}
		return false;
		
	});
	
	$("#page3").swipeleft(function(evt){
		evt.stopImmediatePropagation();
		evt.stopPropagation();
		evt.preventDefault();
		if(event.handled !== true)
		{
			$.mobile.showPageLoadingMsg();
			numpage = $("#suivant").val();
			console.log("swipe left: "+$("#suivant").val());
			console.log("show loading");
			$.ajax({
				url: xml,
				dataType: "xml",
				async: false,
				success: function(xml) {
					if(numpage != ""){
						$("#manga").html($(createVisu(xml)));
						console.log("normalement c'est cache...");
					}else{
						$.mobile.hidePageLoadingMsg(); 
					}
				},
				error: function(objRequest, jqxhr, settings, exception){
					alert("error:"+jqxhr);
				}
			});
			event.handled = true;
		}
		return false;
		
	});
	
	
	$("#page3").swiperight(function(evt){
		evt.stopImmediatePropagation();
		evt.stopPropagation();
		evt.preventDefault();
		if(event.handled !== true)
		{
			$.mobile.showPageLoadingMsg();
			numpage = $("#precedent").val();
			console.log("swipe right: "+$("#precedent").val());
			$.ajax({
				url: xml,
				dataType: "xml",
				async: false,
				success: function(xml) {
					if(numpage != ""){
						$("#manga").html($(createVisu(xml)));
					}else{
						$.mobile.hidePageLoadingMsg(); 
					}
				},
				error: function(objRequest, jqxhr, settings, exception){
					alert("error:"+jqxhr);
				}
			});
			event.handled = true;
		}
		return false;
		
	});
	
	
	$(".lienmanga").live("click", function(){
		xml = $(this).attr("url");
	});
	$(".lienchapitre").live("click", function(){
		chapitre = $(this).attr("numero");
	});
	$("#lien-pcdt").click(function(){
		$("#page3").trigger("swiperight");
	});
	$("#lien-svt").click(function(){
		$("#page3").trigger("swipeleft");
	});
	
	
});



function init(){
	
	$(document).bind('mobileinit', function(){
		$.mobile.metaViewportContent = 'width=device-width, minimum-scale=1, maximum-scale=2';
	}); 
	
	$("img").bind('touchstart', function(event) {
		console.log($(this));
		console.log(event);
		for (var i = 0; i < event.targetTouches; i++) {
			var touch = event.targetTouches[i];
			console.log('touched ' + touch.identifier);
		}
	});
	
	$('[data-role=page]').bind('pageshow', function (event, ui) {
	    try {
	    	console.log("");
	        _gaq.push(['_setAccount', 'UA-35625239-1']);

	        hash = location.hash;

	        if (hash) {
	            _gaq.push(['_trackPageview', hash.substr(1)]);
	        } else {
	            _gaq.push(['_trackPageview']);
	        }
	    } catch(err) {

	    }
	    
	});

}

	