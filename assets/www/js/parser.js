/**
 * Parser de fichier XML pour une lecture des images
 * 
 * @author Remy Mandon
 * @date 2012-10-13
 */


function createVisu(xml){
	var page = $(xml).find("chapitre[numero='"+chapitre+"'] pages page[numero='"+numpage+"']");
	$("#page3 div[data-role='header'] h1").html("Chap "+chapitre+"-Page "+numpage);
//	$("#page3 div[data-role='header'] h1").html($(xml).find("name").text()+" - "+$(xml).find("chapitre[numero='"+chapitre+"'] titre").text()+" - Page "+numpage);
//	alert($(page[0]).find("url").text());
	var div = $("<div>");
//	console.log(page);
	$(div).append($("<input>")
						.attr("type", "hidden")
						.attr("id", "precedent")
						.val($(page).find("precedent").text())
	);
	$(div).append($("<img>")
					.attr("id", "image-manga")
					.attr("src", $(page).find("url").text())
					.css("width", "100%")
					.load(function(){  $.mobile.hidePageLoadingMsg(); })
					.error(function(){ 
						console.log("failed"); 
						console.log($(this)); 
						$(this).remove();
						$(div).append($("<div>").html("Erreur dans le chargement de l'image. "));
						$.mobile.hidePageLoadingMsg(); 
					})
	);
	$(div).append($("<input>")
						.attr("type", "hidden")
						.attr("id", "suivant")
						.val($(page).find("suivant").text())
	);
	/*$(xml).find("chapitre[numero='"+chapitre+"'] pages page").each(function(){
		$("#select-page").append(
				$("<li>").val($(page).attr("numero"))
						 .attr("name", $(page).attr("numero"))
		);
	});*/
	
	return div;
}