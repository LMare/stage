/*
	Criticité des Composants

*/


(function () {

	var server = "";// mettre le chemin d'acces

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
	
	/*logIn*/
	$("#login_submit").on("click", function (event) {
		event.preventDefault();
		console.log('oki');
		$.get({
			"url" : server+"/login",
			"data" : {"login" : $('#login_id').value, "password" : $('#login_mdp').value},
			"dataType" : "html"
		}).then(function(response) {
			$('#main').show();
			$('#login').hide();
			$('#nav_login').hide();
		}).catch(function(error) {
			console.log("Une erreur est survenue : " + error);
		});
	});

	
	
	
	function refreshTab() {
		var filtres = {};
		var filterListe = $('#Filter-List').find('li:not(.filter-template)');
		filterListe.each(function(){
			filtre[$(this).find('Category')].add({'op' : $(this).find('Operator'), 'value' : $(this).find('Operand')});
		});
		
		$.get({
			"url" : server + "/Criticity",
			"data" : "filter="+filtre,
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
	
	function trim(x) {
		x;
		return x.replace(/^\s+|\s+$/gm,'');
	}

})();