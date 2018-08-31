/*
	Criticité des Composants

*/


(function ($) {
	
	var lineSelec = null;
	//var filtreCategory = ["CRITICITY_GLOBAL", "ARTICLE", "MATURITY", "TYPE_ARTICLE", "GRADE", "PACL_NOM", "GRADE_MIN", "DESC_ART", "PROVENANCE"]; //TODO: Rajouter
	//Amélioration de filtreCategory pour avoir le "nom fr" afficher et filtrer dans n'importe quelle table 
	// Mettre "admin" : true, si un admin peut changer la valeur du champ ("isc" : true pour le commentaire)
	var filtreCategory2 = { 
		
		"Version 3E" : {"table" : "PCDB_INFOS_3E", "name" : "S3E_VERSION"},
		"Description 3E" : {"table" : "PCDB_INFOS_3E", "name" : "I3EP_DESCRIPTION"},
		"Family Code" : {"table" : "PCDB_INFOS_3E", "name" : "I3EP_FAMILY_CODE"},
		"Group Code" : {"table" : "PCDB_INFOS_3E", "name" : "I3EP_GROUP_CODE"}, 
		
		
		"PLC status" : {"table" : "PCDB_INFOS_3E", "name" : "I3E_PLCSTATVAL"},
		"PPL" : {"table" : "PCDB_INFOS_3E", "name" : "I3EP_PPL"},
		"Export IS" : {"table" : "PCDB_INFOS_3E", "name" : "I3EP_EXPORT_IS"},
		"NS Category" : {"table" : "PCDB_INFOS_3E", "name" : "I3EP_NS_CATEGORY"},
		"Criticality" : {"table" : "PCDB_INFOS_3E", "name" : "I3EP_CRITICALITY"},
		"ESD" : {"table" : "PCDB_INFOS_3E", "name" : "I3EP_ESD_STATUS"},
		"MSL" : {"table" : "PCDB_INFOS_3E", "name" : "I3EP_MSL"},
		"Package" : {"table" : "PCDB_INFOS_3E", "name" : "I3EP_PACKAGE"},
		/*
			... TODO
		*/
		
		
		
		"3E_Part" : {"table" : "CRITICITE", "name" : "CRITICITE.S3E_NUMBER"}, 
		"Criticité globale" : {"table" : "CRITICITE", "name" : "CRITICITY_GLOBAL"}, 
		"Risque ELEC" : {"table" : "CRITICITE", "name" : "RISQUE_QUALITATIF_ELEC", "admin" : true}, 
		"Risque CPST" : {"table" : "CRITICITE", "name" : "RISQUE_QUALITATIF_CPST", "admin" : true}, 
		"Risque Assemblage" : {"table" : "CRITICITE", "name" : "RISQUE_QUALITATIF_ASSEMBLY", "admin" : true}, 
		"Risque RAD" : {"table" : "CRITICITE", "name" : "RISQUE_QUALITATIF_RAD", "admin" : true}, 
		"Monosource" : {"table" : "CRITICITE", "name" : "MONOSOURCES", "admin" : true}, 
		"Origine US" : {"table" : "CRITICITE", "name" : "ORIGIN_US", "admin" : true}, 
		"ETCA" : {"table" : "CRITICITE", "name" : "ETCA", "admin" : true}, 
		"OQD" : {"table" : "CRITICITE", "name" : "OQD", "admin" : true}, 
		"OTD" : {"table" : "CRITICITE", "name" : "OTD", "admin" : true}, 
		"Maturité Technologique" : {"table" : "CRITICITE", "name" : "MAT_TECH", "admin" : true}, 
		"Risque tri" : {"table" : "CRITICITE", "name" : "RISQUE_TRI", "admin" : true}, 
		"Risque société" : {"table" : "CRITICITE", "name" : "RISQUE_SOCIETE", "admin" : true}, 
		"CRITICITY HANDLING STORAGE" : {"table" : "CRITICITE", "name" : "CRITICITY_HANDLING_STORAGE", "admin" : true}, 
		"Remède" : {"table" : "CRITICITE", "name" : "REMEDE", "admin" : true}, 
		
		
		"Commentaires" : {"table" : "COMMENT_ICS", "name" : "TEXT_COMMENT", "ICS" : true, "admin" : true},
		"Dernier Commentaire" : {"table" : "COMMENT_ICS", "name" : "LAST_COMMENT"},
		"Date Commentaire" : {"table" : "COMMENT_ICS", "name" : "DATE_LOG"},
		"Editeur Commentaire" : {"table" : "COMMENT_ICS", "name" : "ID_USER_ICS"},
		
		
		"Source" : {"table" : "SOURCES", "name" : "SOURCE"}, 
		
		
		"PACL" : {"table" : "PACL", "name" : "PACL_NOM"}, 
		"Grade Min" : {"table" : "PACL", "name" : "GRADE_MIN"},
		"Grade" : {"table" : "PACL", "name" : "PACL.GRADE"}, 
		"Maturité" : {"table" : "PACL", "name" : "MATURITY"}, 
		
		
		"Lead Time" : {"table" : "PPL	", "name" : "LEADTIME"},
		"PMP" : {"table" : "PPL	", "name" : "PMP"}
		
		// TODO: Rajouter !
	};
	
	
	
	
	

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

	
	$('#addFilter').on("submit", function(e) {
		e.preventDefault();
		var addFilter_Category = $('#addFilter_Category');
		var category = addFilter_Category.val();
		var operator = $('#addFilter_Operator').val();
		var operand = $('#addFilter_Operand').val();
		if(category !== null && category !== '' && operator !== null && operator !== '' && operand !== null && operand !== '') {
			var template = $("#Filter-List").find(".filter-template");
			var clone = template.clone();
			clone.removeClass('filter-template');			
			var div = clone.find('.Category');
			div.each(function(){
				$(this).val(addFilter_Category.val());
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
				var txt = addFilter_Category.val() + ' ' + $('#addFilter_Operator').val() + ' ' + $('#addFilter_Operand').val();
				$(this).text(txt);
			});
			div = clone.find('.delete');
			div.each(function(){
				addDelButtonAction(this);
			});	
			clone.appendTo($('#Filter-List'));
			$('#addFilter')[0].reset();
			//addFilter_Category.focus();  // Permet d'aller plus vite lors de la saisie des filtres mais cache la liste des filtre avec l'autocompletion... 
			refreshTab();
		} else {
			console.log('Champ incorrect');
		}
		
	});
	
	
	
	$('#addFilter_annul').on("click", function() {
		/*$('#addFilter').hide();
		$('#buttonAddFilter').show();*/
		$('#addFilter')[0].reset();
	});
	
	function addDelButtonAction(button) {
		$(button).on('click',function() {
			var container = $(this).parent();
			var li = container.parent();
			li.remove();
			refreshTab();
		});
	}
	
	//autocompletion
	autocomplete(document.getElementById("addFilter_Category"), (Object.keys(filtreCategory2)).sort());
	var searchComplete = autocomplete2(document.getElementById("addFilter_Operand"));
	$('#addFilter_Operand').on("click focus input", function (event) {
		event.preventDefault();
		event.stopPropagation();
		var val = $(this).val();
		var cate = $('#addFilter_Category').val();
		var table, name;
		try{
			table = filtreCategory2[cate]["table"];
			name = filtreCategory2[cate]["name"];
			if(!name) return ;
			$.get({
				"mimeType": 'text/plain; charset= Windows-1252',
				"url" : "./routage/bdd.asp",
				"data" : {"type" : "search", "table" : table, "nameColumn" : name, "val" : val}, 
				"dataType" : "json"
			}).then(function (arr) {
				searchComplete.show(arr);
			}).catch(function (error) {
				console.log('error bdd');
			});
		} catch(error) {
			console.log('error : filtre non prédéfini');
		}
	});
	

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
	
	/*logout*/ 
	$('#nav_logout').on("click", function(event) {
		$.get({
			"url" : "./routage/logout.asp"
		}).then(function() {
			$('#nav_login').show();
			$('#nav_logout').hide();
		}).catch(function(error) {
			console.log("Une erreur est survenue : ");
			//console.log(error)
		});
	});
	
	/*	Preferences	*/
	
	
	// Chargement des préférences
	// TODO: améliorer le code en supprimant la redondance et en mettant de la délégation d'evenement
	var pref = { "Components" : {}, "Detail" : {}, "Sources" : {} };
	$.get({
		"url" : "./routage/bdd.asp",
		"data" : {"type" : "getHideCol"},
		"dataType" : "json"
	}).then(function(data) {
		pref = data;
		$.each(pref["Components"], function(scope, val) {
			$('#tableContainer').find("[scope="+scope+"]").hide();
		});
		$.each(pref["Detail"], function(scope, val) {
			$('#ComponentContainer').find("[scope="+scope+"]").hide();
		});
		$.each(pref["Sources"], function(scope, val) {
			$('#SourcesContainer').find("[scope="+scope+"]").hide();
		});
	}).catch(function(err) {
		console.log('erreur lors du chargement des préférences');
	}).always(function () { // Création de la page préférences
		$('#tableContainer').find('th:not(th.adjustment)').each(function () {
			var id = 'col0_'+$(this).text();
			var scope = $(this).attr("scope");
			var elem1 = pref["Components"][scope] ?  $("<input type='checkbox'></input").attr("id", id) : $("<input type='checkbox' checked></input").attr("id", id);
			var elem2 = $("<label></label>").text($(this).text());
			elem2.attr("for", id);
			elem1.on("click", function (){
				if($(this).is(":checked")) {
					$('#tableContainer').find("[scope="+scope+"]").show();
					$.post({
						"url" : "./routage/bdd.asp",
						"data" : {"type" : "showCol", "tab" : "Components", "col" : scope}
					});
					pref["Components"][scope] = false;
				} else {
					$('#tableContainer').find("[scope="+scope+"]").hide();
					$.post({
						"url" : "./routage/bdd.asp",
						"data" : {"type" : "hideCol", "tab" : "Components", "col" : scope}
					});
					pref["Components"][scope] = true;
				}
			});
			$('#listInputPreferencesTab').append(elem1, elem2, "<br/>");
		});
		$('#ComponentContainer').find('th').each(function () {
			var id = 'col1_'+$(this).text();
			var scope = $(this).attr("scope");
			var elem1 = pref["Detail"][scope] ?  $("<input type='checkbox'></input").attr("id", id) : $("<input type='checkbox' checked></input").attr("id", id);
			var elem2 = $("<label></label>").text($(this).text());
			elem2.attr("for", id);
			elem1.on("click", function (){
				if($(this).is(":checked")) {
					$('#ComponentContainer').find("[scope="+scope+"]").show();
					$.post({
						"url" : "./routage/bdd.asp",
						"data" : {"type" : "showCol", "tab" : "Detail", "col" : scope}
					});
					pref["Detail"][scope] = false;
				} else {
					$('#ComponentContainer').find("[scope="+scope+"]").hide();
					$.post({
						"url" : "./routage/bdd.asp",
						"data" : {"type" : "hideCol", "tab" : "Detail", "col" : scope}
					});
					pref["Detail"][scope] = true;
				}
			});
			$('#listInputPreferencesComp').append(elem1, elem2, "<br/>");
		});
		$('#SourcesContainer').find('th').each(function () {
			var id = 'col2_'+$(this).text();
			var scope = $(this).attr("scope");
			var elem1 = pref["Sources"][scope] ?  $("<input type='checkbox'></input").attr("id", id) : $("<input type='checkbox' checked></input").attr("id", id);
			var elem2 = $("<label></label>").text($(this).text());
			elem2.attr("for", id);
			elem1.on("click", function (){
				if($(this).is(":checked")) {
					$('#SourcesContainer').find("[scope="+scope+"]").show();
					$.post({
						"url" : "./routage/bdd.asp",
						"data" : {"type" : "showCol", "tab" : "Sources", "col" : scope}
					});
					pref["Sources"][scope] = false;
				} else {
					$('#SourcesContainer').find("[scope="+scope+"]").hide();
					$.post({
						"url" : "./routage/bdd.asp",
						"data" : {"type" : "hideCol", "tab" : "Sources", "col" : scope}
					});
					pref["Sources"][scope] = true;
				}
			});
			$('#listInputPreferencesSources').append(elem1, elem2, "<br/>");
		});
	});
	
	
	
	/*	Tableau	*/
	
	$(document).ready(refreshTab);
	function refreshTab() {
		var filtres = {};
		var filterListe = $('#Filter-List').find('li:not(.filter-template)');
		filterListe.each(function(){
			var cate = $(this).find('.Category').val();
			var ope = $(this).find('.Operator').val();
			var val = $(this).find('.Operand').val();
			if (filtreCategory2[cate]) {
				cate = filtreCategory2[cate]["name"]; // accepte le "nom fr" et la colonne de la bdd
			}
			
			
			if(filtres[cate] == null) filtres[cate] = [];
			filtres[cate][(filtres[cate]).length] = [ope, val];
		});
		
		//Version1
			// défauts : le select des colonnes dans la bdd doit être dans le bon ordre, sinon pb d'affichage 
		
		$.get({
			"url" : "./routage/bdd.asp",
			"data" : {"type" : "getRows", "filter" : JSON.stringify(filtres)},
			"dataType" : "html"
		}).then(function(data){
			var tbody = $("#tbody");
			tbody.find('tr:not(.important)').remove();
			tbody.hide();
			tbody.append(data);
			$.each(pref["Components"], function(scope, val) {
				if(val) $('#tbody').find("td[scope="+scope+"]").hide();
			});
			tbody.show();
			$('#nbelem').text($('#tbody > *').length -2 + '');
		}).catch(function(error) {
			console.log(error);
		});		
	}
	
	
	/* Component	*/
	
	/*	Affichage d'un composant quand on click dans le tableau	*/
	$('#tableContainer').on('click', 'table tbody tr', function () {
		if (lineSelec !== null) lineSelec.removeClass("selected");
		lineSelec = $(this);
		lineSelec.addClass("selected")
		
		$(this).find("td[scope=S3E_NUMBER]").each(function() {
			num = $(this).text();
		});
		$.get({
			"mimeType": 'text/plain; charset= Windows-1252',
			"url" : "./routage/bdd.asp",
			"data" : {"type" : "component", "id" : num}, 
			"dataType" : "json"
		}).then(function(datas) {			
			// Affichage des infos sur le composant
			$('#tbodyComponent').find('td').each(function() {
				var td = $(this);
				var scope = td.attr('scope');
				if(scope === "PACL") {
					var html = "";
					for(cle in datas["PACL"]) {
						html += datas["PACL"][cle] + "<br/>";
					}
					td.children('p').html(html);
				} else if (scope === "TEXT_COMMENT") {
					td.children('p').text(datas[scope]+"");
					td.children('p').attr("oldValue", datas[scope]+"");
				} else if (td.hasClass('ADMIN')) {
					td.children('p').text(datas[scope]+"");
					td.children('p').attr("oldValue", datas[scope]+"");
					if(datas[scope] >= 5) {
						if(!td.hasClass("critique")) td.addClass("critique");
					} else {
						if(td.hasClass("critique")) td.removeClass("critique");
					}
				} else if (scope === "Part-Number") {
					td.children('a').attr("href", "https://pcdb.space.thales/Windchill/netmarkets/jsp/part/partDisplay.jsp?number=" + datas[scope]);
					td.children('a').text(datas[scope]+"");
				} else {
					td.text(datas[scope]+"");
				}
			});
			// Affichages des Sources
			var tbody = $('#SourcesTable').children("tbody");
			
			tbody.find('tr:not(tr.trClonable)').remove();
			$.each(datas.SOURCES, function() {
				var data = this;
				var clone = tbody.find('tr.trClonable').clone();
				clone.removeClass("trClonable");
				clone.find("td").each(function() {
					var td = $(this);
					var scope = td.attr("scope");
					td.text(data[scope]);
				});
				clone.show()
				tbody.append(clone);
			});
		}).catch(function(error){
			console.log("erreur");
			console.log(error);
		});
	});
	
	
	if(!(_ADMIN || _ICS)) {
		$('.containerButton2').hide();
		$('#ComponentContainer').css("width", "100%");
	}
	
	$('#tbodyComponent').find("td.Number").each(function() {
		var html = "";
		html +=	"<p value='' oldValue=''></p>";
		html +=		"<div class='containerButton3' style='display: none'>";
		html +=			"<input type='number' min='0' max='5' value='0'/>";
		html +=		"</div>";
		$(this).append(html);
	});
	
	
	// dblclick sur une case
	$('#tbodyComponent').on("dblclick", "tr td p", function() {
		if(!$('#tbodyComponent').find("td[scope = Part-Number] a").text()) return;
		var p = $(this);
		var td = p.parent();
		var div = td.children("div");
		var input = div.children("input");
		if(!(td.hasClass("ADMIN") && _ADMIN || td.hasClass("ICS") && _ICS)) return;
		input.val(p.text());
		setTimeout(function() {input.focus();}, 50);
		div.show();
		p.hide();
	});
	
	//sortir de l'éditeur 
	$('#tbodyComponent').on("focusout", "input", function(){
		var input = $(this);
		var div = input.parent();
		var p = div.parent().children('p');
		p.text(input.val());
		p.show();
		div.hide();
	});
	
	// Bouton valider
	$('#validComponent').on("click", function() {
		var tbody = $("#tbodyComponent");
		var id = tbody.find("td[scope=Part-Number] a").text();
		if(!id) return;
		if(_ICS || _ADMIN) {
			var  p = tbody.find("td[scope=TEXT_COMMENT] p");
			var val = p.text();
			if(val != p.attr("oldValue")) {
				$.post({
					"url" : "./routage/bdd.asp",
					"data" : {
								"type" : "addComment",
								"id" : id,
								"val" : val
							},
					"Content-Type" : "text/plain;charset='utf-8'"
				}).then(function(data) {
					// signaler que tout est ok ???
				}).catch(function(error) {
					// erreur => pas eu de changement en bdd => on remet l'ancienne valeur
					console.log('error commentaires');
					p.text(p.attr("oldValue"));
					//console.log(error );
				});
			}
		}
		if(_ADMIN) {
			var values = {};
			tbody.find("td.ADMIN:not(td.ICS)").each(function() {
				var td = $(this);
				values[td.attr('scope')] = td.children('p').text();
			});
			$.post({
				"url" : "./routage/bdd.asp",
				"data" : {
							"type" : "updateCriticity",
							"id" : id,
							"values" : JSON.stringify(values)
						},
				"Content-Type" : "text/plain;charset='utf-8'",
				"dataType" : "json"
			}).then(function(data) {
				// signaler que tout est ok ???
				//TODO: mettre à jour les anciennes values  ??? 
				$('#tbodyComponent').find("td[scope = CRITICITY_GLOBAL]").text(data["CRITICITY_GLOBAL"]);
				$('#tbody').find("tr.selected td[scope=CRITICITY_GLOBAL]").text(data["CRITICITY_GLOBAL"]);
			}).catch(function(error) {
				// erreur => pas eu de changement en bdd => on remet l'ancienne valeur
				console.log('error update');
				//remettre les anciennes valeurs !! 
				/*tbody.find("td.ADMIN:not(td.ICS)").each(function() {
					var p = $(this).children('p');
					p.text(p.attr("oldValue")); //Pas forcement la bonne valeur si il y a eu plusieurs changement...
				});*/
				$('#tbody').find("tr.selected td[scope=CRITICITY_GLOBAL]").click(); // Refresh avec les valeurs de la bdd
			});
		}
	});
	
	
	// annulation des derniers changements
	$('#annulComponent').on("click", function() {
		var tbody = $("#tbodyComponent");
		var id = tbody.find("td[scope=Part-Number] a").text();
		if(!id) return;
		if(_ICS || _ADMIN) {
			var  p = tbody.find("td[scope=TEXT_COMMENT] p");
			var oldValue =  p.attr("oldValue")
			if(oldValue != p.text()) {
				$.post({
					"url" : "./routage/bdd.asp",
					"data" : {
								"type" : "addComment",
								"id" : id,
								"val" : oldValue
							},
					"Content-Type" : "text/plain;charset='utf-8'"
				}).then(function(data) {
					// signaler que tout est ok ???
					p.text(oldValue);
				}).catch(function(error) {
					console.log('error commentaires');
					//console.log(error );
				});
			}
		}
		if(_ADMIN) {
			var values = {};
			tbody.find("td.ADMIN:not(td.ICS)").each(function() {
				var td = $(this);
				values[td.attr('scope')] = td.children('p').attr("oldValue");
			});
			$.post({
				"url" : "./routage/bdd.asp",
				"data" : {
							"type" : "updateCriticity",
							"id" : id,
							"values" : JSON.stringify(values)
						},
				"Content-Type" : "text/plain;charset='utf-8'",
				"dataType" : "json"
			}).then(function(data) {
				// signaler que tout est ok ???
				tbody.find("td.ADMIN:not(td.ICS)").each(function() {
					var p = $(this).children('p');
					p.text(p.attr("oldValue"));
				});
				$('#tbodyComponent').find("td[scope = CRITICITY_GLOBAL]").text(data["CRITICITY_GLOBAL"]);
				$('#tbody').find("tr.selected td[scope=CRITICITY_GLOBAL]").text(data["CRITICITY_GLOBAL"]);
			}).catch(function(error) {
				// erreur => pas eu de changement en bdd => on remet l'ancienne valeur
				console.log('error annulation');
				//TODO: anciennes valeurs !! 
			});
		}
	});
	
	
	

	/*Quick update*/
	if(_ADMIN ||_ICS) $('#divQuickUpdate').show();
	
	var tab = [];
	if(_ADMIN) {
		$.each(filtreCategory2, function(key, value) {
			if(value["admin"]) tab.push(key);
		});
	}
	if(_ICS) {
		$.each(filtreCategory2, function(key, value) {
			if(value["ICS"]) tab.push(key);
		});
	}
	autocomplete(document.getElementById("quickUpdateColumn"), tab.sort());
	
	
	$('#quickUpdate').on("submit", function(e) {
		e.preventDefault();	
		if(!_ADMIN) return;
		var filtres = {};
		var filterListe = $('#Filter-List').find('li:not(.filter-template)');
		filterListe.each(function(){
			var f = $(this);
			var cate = f.find('.Category').val();
			var ope = f.find('.Operator').val();
			var val = f.find('.Operand').val();
			if (filtreCategory2[cate]) {
				cate = filtreCategory2[cate]["name"];
			}
			
			
			if(filtres[cate] == null) filtres[cate] = [];
			filtres[cate][(filtres[cate]).length] = [ope, val];
		});
		var col  = $('#quickUpdateColumn').val();
		if(!filtreCategory2[col]) return;
		
		var table = filtreCategory2[col]["table"];
		col = filtreCategory2[col]["name"];
		var value;
		if(col =='REMEDE' || col == 'TEXT_COMMENT') {
			val = $('#quickUpdateValueText').val();
		} else {
			val = $('#quickUpdateValueNumber').val();
		}
		console.log(val);
		if(val=='') return;
		
		$.post({
			"url" : "./routage/bdd.asp",
			"data" : {
						"type" : "multi-update",
						"table" : table,
						"column" : col,
						"value" : val, 
						"filter" : JSON.stringify(filtres)
					}
		}).then(function(res) {
			$('#quickUpdate')[0].reset();
			refreshTab();
			console.log(res)
		}).catch(function(err) {
			console.log("erreur");
		});		
	});
	
	$('#quickUpdateColumn').on("input focusout", function() {
		var col = $(this);
		var text = $('#quickUpdateValueText');
		var number = $('#quickUpdateValueNumber');
		if(col.val() == 'Commentaires' || col.val() == 'Remède') {
			if(text.is(":hidden") || number.is(":visible")) {
				text.show();
				text.focus();
				number.hide();
				number.val(0);
			}
		} else {
			if(number.is(":hidden") || text.is(":visible")) {
				number.show();
				text.hide();
			}
		}
		
		
	});
	
	
	$('#quickUpdateAnnul').on("click", function() { //ne fait qu'un reset
		$('#quickUpdate')[0].reset();
	});
	
	/*Exportation du  tableau en csv */
	$('#nav_expot').on("click", function(e) {
		// generation
		var txt = "";
		$('#thead').find("tr").each(function(){
			var tr = $(this);
			tr.find("th:not([style='display: none;'])").each(function() {
				var th = $(this);
				txt += th.text() + ";"
			});
			txt += "\n"
		});
		
		$('#tbody').find("tr:not(.important)").each(function(){
			var tr = $(this);
			tr.find("td:not([style='display: none;'])").each(function() {
				var td = $(this);
				txt += td.text() + ";"
			});
			txt += "\n"
		});
		
		$.post({
			"url" : "routage/export.asp", 
			"data" : {"datas" : txt}, 
			"dataType" : "text", 
			"Content-Type" : "text/plain;charset='utf-8'" //Si pb d'encodage essayer avec : "mimeType": 'text/plain; charset= Windows-1252',
		}).then(function(file) {
			window.open(file,"_blank", null);
		}).catch(function(err) {
			console.log("erreur export");
		});
		
		
	});
	


})(jQuery);