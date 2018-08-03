/*
	Criticité des Composants

*/


(function () {

	$("#test").on("click", function () {
		console.log('test');
		$.get({
			"url" : "./routage/bdd.asp",
			"data" : {"type" : "test"}, 
			"dataType" : "html"
		}).then(function(data) {
			console.log('oki');
			console.log(data);
			//$('#tbody').replaceWith(data);
			$('#tbody').find('tr:not(tr.trResizeTbody)').remove();
			$('#tbody').append(data);
		}).catch(function(error) {
			console.log("erreur dans la connexion a la base de donnee");
			console.log(error);
		});
	});
	
	
	

	/*	Filtres	*/
	$('#buttonShowFilters').on("click", function() {
		$('#heavy').show();
		$('#buttonHideFilters').show();
		$('#buttonShowFilters').hide();
	});

	
	$('#buttonHideFilters').on("click", function() {
		$('#heavy').hide();
		$('#buttonHideFilters').hide();
		$('#buttonShowFilters').show();
	});

	$('#buttonAddFilter').on("click", function() {
		$('#addFilter').show();
		$(this).hide();
	});
	
	$('#addFilter_valid').on("click", function() {
		var category = $('#addFilter_Category').val();
		var operator = $('#addFilter_Operator').val();
		var operand = $('#addFilter_Operand').val();
		if(category !== null && category !== '' && operator !== null && operator !== '' && operand !== null && operand !== '') {
			var template = $("#Filter-List").find(".filter-template");
			var clone = template.clone();
			clone.removeClass('filter-template');			
			var div = clone.find('.Category');
			div.each(function(){
				$(this).val($('#addFilter_Category').val());
			});
			div = clone.find('.Operator');
			div.each(function(){
				$(this).val($('#addFilter_Operator').val());
			});
			div = clone.find('.Operand');
			div.each(function(){
				$(this).val($('#addFilter_Operand').val());
			});
			div = clone.find('.text');
			div.each(function(){
				var txt = $('#addFilter_Category').val() + ' ' + $('#addFilter_Operator').val() + ' ' + $('#addFilter_Operand').val();
				$(this).text(txt);
			});
			div = clone.find('.delete');
			div.each(function(){
				addDelButtonAction(this);
			});	
			clone.appendTo($('#Filter-List'));
			$('#addFilter').hide();
			$('#buttonAddFilter').show();
			$('#addFilter')[0].reset();
		} else {
			console.log('Champ incorrect');
		}
		
	});
	
	$('#addFilter_annul').on("click", function() {
		$('#addFilter').hide();
		$('#buttonAddFilter').show();
		$('#addFilter')[0].reset();
	});
	
	function addDelButtonAction(button) {
		$(button).on('click',function() {
			var container = $(this).parent();
			var li = container.parent();
			li.remove();
		});
	}

	/*	Navigation */
	
	$('#nav_logout').hide();
	
	$("#nav_login").on("click", function () {
		$('#nav').find('.current-page-item').each(function(){
			$(this).removeClass('current-page-item');
		});
		$(this).addClass('current-page-item');
		
		$('#main').hide();
		$('#preferences').hide();
		$('#login').show();
	});
	$("#nav_component").on("click", function () {
		$('#nav').find('.current-page-item').each(function(){
			$(this).removeClass('current-page-item');
		});
		$(this).addClass('current-page-item');
		$('#main').show();
		$('#login').hide();
		$('#preferences').hide();
	});
	
	$('#nav_preferences').on("click", function () {
		$('#nav').find('.current-page-item').each(function(){
			$(this).removeClass('current-page-item');
		});
		$(this).addClass('current-page-item');
		$('#main').hide();
		$('#login').hide();
		$('#preferences').show();
	});
	
	/*logIn*/
	$("#login_submit").on("click", function (event) {
		event.preventDefault();
		console.log('oki');
		$.get({
			"url" : "./routage/login.asp",
			"data" : {"login" : $('#login_id').value, "password" : $('#login_mdp').value},
			"dataType" : "text"
		}).then(function(response) {
			$('#main').show();
			$('#login').hide();
			$('#nav_login').hide();
			$('#nav_logout').show();
			console.log("reponse = "+response);
		}).catch(function(error) {
			console.log("Une erreur est survenue : ");
			console.log(error)
		});
	});

	/*logout*/
	$('#nav_logout').on("click", function(event) {
		$.get({
			"url" : "./routage/logout.asp"
		}).then(function() {
			$('#nav_login').show();
			$('#nav_logout').hide();
		}).catch(function(error) {
			console.log("Une erreur est survenue : ");
			console.log(error)
		});
	});
	
	/*	Preferences	*/
	
	$('#tableContainer').find('th').each(function () {
		var id = 'col_'+$(this).text();
		var scope = $(this).attr("scope");
		var elem1 = $("<input type='checkbox' checked></input").attr("id", id); // add : checked ??? / cookies ?
		var elem2 = $("<label></label>").text($(this).text());
		elem2.attr("for", id);
		elem1.on("click", function (){
			//alert($(this).is(":checked"));
			if($(this).is(":checked")) {
				$('#tableContainer').find("[scope="+scope+"]").each(function () {
					$(this).show();
				});
			} else {
				$('#tableContainer').find("[scope="+scope+"]").each(function () {
					$(this).hide();
				});
			}
		});
		$('#listInputPreferences').append(elem1, elem2, "<br/>");
	});
	
	
	
	/*	Tableau	*/
	function refreshTab() {//TODO: FINIR !
		var filtres = {};
		var filterListe = $('#Filter-List').find('li:not(.filter-template)');
		filterListe.each(function(){
			filtre[$(this).find('Category')].add({'op' : $(this).find('Operator'), 'value' : $(this).find('Operand')});
		});
		
		$.get({
			"url" : "./bdd.asp",
			"data" : {"type" : "getRows", "filter" : filtre},
			"dataType" : "json"
		}).then(function(data){
			//TODO: supprimer + Charger le Tableau !!! 
			var data = this;
			$('#tbody').find('tr').remove();
			$.each(data, function() {
				var clone = $('#Tab-line');
				clone.find('td').each(function() {
					var scope = $(this).scope();
					$(this).text(data[scope]);
				});
			});
		}).catch(function(error) {
			console.log(error);
		});
	}
	
	
	
	/*
	function trim(x) {
		x;
		return x.replace(/^\s+|\s+$/gm,'');
	}*/

})();