<!DOCTYPE HTML>

<!-- html pour l'interface Criticity -->
<html>
	<!--#include virtual="/__ETCA_Security/check_permissions.asp" -->
	<%
		call check_permission("0", "CRITICITE","")   
	%>
	
	<head>
		<title>Criticité</title>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<link rel="stylesheet" href="assets/css/autocomplete.css" />
		<link rel="stylesheet" href="assets/css/main.css" />
	</head>
	<script>
		var _USERNAME = "<%= SESSION("USERNAME")%>" ;
		var _ADMIN = '<%=canViewLevel(3)%>' == 'True';
		var _ICS = '<%= canViewLevel(2)%>' == 'True' && !_ADMIN;
		// console.log(_USERNAME + " => " + _ADMIN + ' |  ' + _ICS);
		//_ADMIN = false; //pour les tests
		//_ICS = false;
	</script>
	<body>
		<div id="wrapper">
			<div id="header-wrapper">
				<div class="container">
					<div class="row">
						<header id="header">
							<h1>Criticité</h1>
							<nav id="nav">
								<a class="current-page-item" id='nav_component'>Composants</a>
						<!--		<a id="nav_login">Connexion</a> <!-- hidden if connected --> 
								<!-- <a>Mon Compte</a> -->
								<a id="nav_logout" >Déconnexion</a>
								<a id="nav_preferences">Préférences</a>
							</nav>
						</header>
					</div>
				</div>
			</div>
			
			
			<div id="main">
				<div class="filter">
					<div class="containerFilter">
						<div class="light">
							<h2>Liste des filtres</h2>
							<div class="containerButton">	
								<input type="button" value="Afficher" id="buttonShowFilters"/>
								<input type="button" value="Masquer" id="buttonHideFilters" style="display : none"/>
							</div>
						</div>
						<div class="heavy" id="heavy" style="display : none"> <!-- Show/hide in function of button -->
							<div class="containerAddFilter">
								<!--<input type="button" value="Ajouter un filtre" id="buttonAddFilter"/> --><!-- open pop-up to add a specific filter -->
							</div>
							<form class="autoComplete" id="addFilter" AUTOCOMPLETE=OFF>
								<!--
								<table class="filter_table">
									<tr>
										<td>nom colonne</td>
										<td>operateur</td>
										<td>valeur</td>
									</tr>
									<tr>
										<td><input type="text" id="addFilter_Category"/></td>
										<td><select id="addFilter_Operator">
											<option value="=">=</option>
											<option value="like">contient</option>
											<option value=">">></option>
											<option value="<"><</option>
										</select></td>
										<td><input type="text" id="addFilter_Operand"/></td>
									</tr>
								</table> -->
								<div class="div01">
									Nom Colonne
									<input type="text" id="addFilter_Category"/>
								</div>
								<div class="div01" style="width: 115px;">
									Operateur
									<select id="addFilter_Operator" style="position: absolute;margin-left: 8px;">
										<option value="=">=</option>
										<option value="like">contient</option>
										<option value=">">></option>
										<option value="<"><</option>
									</select>
								</div>
								<div class="div01">
									Valeur
									<input type="text" id="addFilter_Operand"/>
								</div>
								<div class="inline">
									<span class="horizontal"></span>
									<input type="submit" id="addFilter_valid" value="Valider"/>
									<span class="vertical"></span>
									<input type="button" id="addFilter_annul" value="Annuler"/>
								</div>
							</form>
							
							<ul id="Filter-List">
								<li class="filter-template" > <!-- TODO: Specific display for each column of table ?  -->
									<div class="containerButton">
										<input type="button" id="filter_delete" class="delete" value="X"/>
									</div>
									<input type="hidden" class="Category" value=""/>
									<input type="hidden" class="Operator" value=""/>
									<input type="hidden" class="Operand" value=""/>
									<p class="text"> C'est un filtre template ! </p>
								</li> 
							</ul>
						</div>
					</div>
				</div>
				
	
				<h2 style="display:inline-block">Composants</h2> <p style="display:inline-block">(<span id='nbelem'>0</span> éléments)</p>
				<div id="tableContainer" class="tableContainer">
					<table border="0" cellpadding="0" cellspacing="0" class="scrollTable resizable">
					<thead id='thead' class="fixedHeader">
						<tr id="trtest">
							<th scope="S3E_NUMBER" size="large">3E_Part</th>
							<th scope="S3E_VERSION" size="small">Version 3E</th>
							<th scope="I3EP_DESCRIPTION" size="large">Description</th>
							<th scope="I3EP_FAMILY_CODE" size="small">Family Code</th>
							<th scope="I3EP_GROUP_CODE" size="small">Group Code</th>
							<th scope="GRADE" size="medium">Grade</th>
							<th scope="I3EP_PACKAGE" size="medium">Package</th>
				<!--		<th scope="NONE" size="small">industrial price</th>   -->
							<th scope="MATURITY" size="large">Maturity</th>
							<th scope="I3E_PLCSTATVAL" size="small">PLC status</th>
				<!--			<th scope="I3E_PLCSTATTYPETOUL" size="large">PLC Status Type</th>  -->
				<!--		<th scope="NONE" size="large">PLC Comments</th>  -->
							<th scope="I3EP_PPL" size="small">PPL</th>
							<th scope="I3EP_EXPORT_IS" size="small">Export IS</th>
							<th scope="I3EP_NS_CATEGORY" size="medium">NS Category</th>
							<th scope="I3EP_CRITICALITY" size="small">Criticality</th>
							<th scope="I3EP_ESD_STATUS" size="medium">ESD</th>
							<th scope="I3EP_MSL" size="small">MSL</th>
						<th scope="LEADTIME" size="small">Lead Time</th>
					<!--	<th scope="NONE" size="large">Space Qualified Status</th>
						<th scope="NONE" size="large">TID RADLAT required</th>
						<th scope="NONE" size="large">TNID RADLAT required</th> -->
							<th scope="CRITICITY_GLOBAL" size="small">Criticité Globale</th>
							
							
							
						<!--	<th scope="STATE" size="medium">Statut Source</th>
							<th scope="QUALITE" size="medium">Qualite</th> -->
							
							<th width="9px" class="adjustment"></th> <!-- Pour la scollBar -->
						</tr>	
					</thead>
					<tbody id="tbody" class="scrollContent">
						<tr class="trResizeTbody important" style="visibility: collapse"> <!-- Permet le resize de la partie tbody (ameliorer la fonction => en rajoutant des widthMin ??? )-->
							<!-- ***  /!\ Doit avoir le même nombre de <td> qu'il y a de <th> /!\ *** -->
							<td scope="S3E_NUMBER" size="large"></td>
							<td scope="S3E_VERSION" size="small"></td>
							<td scope="I3EP_DESCRIPTION" size="large"></td>
							<td scope="I3EP_FAMILY_CODE" size="small"></td>
							<td scope="I3EP_GROUP_CODE" size="small"></td>
							<td scope="GRADE" size="medium"></td>
							<td scope="I3EP_PACKAGE" size="medium"></td>
				<!--		<td scope="NONE" size="small">industrial price</td>  -->
							<td scope="MATURITY" size="large"></td>
							<td scope="I3E_PLCSTATVAL" size="small"></td>
				<!--			<td scope="I3E_PLCSTATTYPETOUL" size="large"></td>  -->
				<!--		<td scope="NONE" size="large">PLC Comments</td>  -->
							<td scope="I3EP_PPL" size="small"></td>
							<td scope="I3EP_EXPORT_IS" size="small"></td>
							<td scope="I3EP_NS_CATEGORY" size="medium"></td>
							<td scope="I3EP_CRITICALITY" size="small"></td>
							<td scope="I3EP_ESD_STATUS" size="medium"></td>
							<td scope="I3EP_MSL" size="small"></td>
						<td scope="LEADTIME" size="small"></td>
				<!--		<td scope="NONE" size="large">Space Qualified Status</td>
						<td scope="NONE" size="large">TID RADLAT required</td>
						<td scope="NONE" size="large">TNID RADLAT required</td>  -->
							<td scope="CRITICITY_GLOBAL" size="small"></td>
							
							
						<!--	<td scope="STATE" size="medium"></td>
							<td scope="QUALITE" size="medium"></td> -->
						</tr>
						<tr class="trClonable important"> 
							<td scope="S3E_NUMBER" ></td>
							<td scope="S3E_VERSION" ></td>
							<td scope="I3EP_DESCRIPTION" ></td>
							<td scope="I3EP_FAMILY_CODE" ></td>
							<td scope="I3EP_GROUP_CODE" ></td>
							<td scope="GRADE" ></td>
							<td scope="I3EP_PACKAGE" ></td>
				<!--		<td scope="NONE" >???</td>   --><!-- industrial price -->
							<td scope="MATURITY" ></td>
							<td scope="I3E_PLCSTATVAL" ></td>
				<!--			<td scope="I3E_PLCSTATTYPETOUL" ></td>  -->
				<!--		<td scope="NONE" >PLC Comments</td>  -->
							<td scope="I3EP_PPL" ></td>
							<td scope="I3EP_EXPORT_IS" ></td>
							<td scope="I3EP_NS_CATEGORY" ></td>
							<td scope="I3EP_CRITICALITY" ></td>
							<td scope="I3EP_ESD_STATUS" ></td>
							<td scope="I3EP_MSL" ></td>
						<td scope="LEADTIME" ></td>
					<!--	<td scope="NONE" >Space Qualified Status</td>
						<td scope="NONE" >TID RADLAT required</td>
						<td scope="NONE" >TNID RADLAT required</td> -->
							<td scope="CRITICITY_GLOBAL" ></td>
						</tr>
						<!-- Requête asychrone pour charger le tableau -->
					</tbody>
					</table>
				</div>
				
				
				<div>
					<h2>Détails</h2>
					<div id="ComponentContainer">
						<table id="ComponentTable" border="0" cellpadding="0" cellspacing="0" width="100%" class="resizable">
							<thead>
								<tr>
									<th scope="Part-Number">Part-Number</th>
									<th scope="PACL" >PACL</th>
									<th scope="TEXT_COMMENT" >Commentaires</th>
									<th scope="CRITICITY_GLOBAL" >Criticité globale</th>
									<th scope="RISQUE_QUALITATIF_ELEC" >Risque Qualitatif ELEC</th>
									<th scope="RISQUE_QUALITATIF_CPST" >Risque Qualitatif CPST</th>
									<th scope="RISQUE_QUALITATIF_ASSEMBLY" >Risque Qualitatif Assemblage</th>
									<th scope="RISQUE_QUALITATIF_RAD" >Risque Qualitatif RAD</th>
									<th scope="MONOSOURCES" >Monosource</th>
									<th scope="ORIGIN_US" >Origine US</th>
									<th scope="ETCA" >ETCA</th>
									<th scope="OQD" >OQD</th>
									<th scope="OTD" >OTD</th>
									<th scope="MAT_TECH" >Maturité Technologique</th>
									<th scope="RISQUE_TRI" >Risque tri</th>
									<th scope="RISQUE_SOCIETE" >Risque société</th>
									<th scope="CRITICITY_HANDLING_STORAGE" >CRITICITY HANDLING STORAGE</th>
									<th scope="REMEDE" >Remède</th>
								</tr>
							</thead>
							<tbody id="tbodyComponent">
								<tr>
									<td scope="Part-Number" size="large"><a target="blank" href=''></a></td>
									<td scope="PACL" size="large">
										<p></p>
									</td>
									<td scope="TEXT_COMMENT" class="ICS ADMIN Text" size="large">
										<p oldValue="test"></p>
										<div style="display: none">
											<input type="text" placeholder="Changer le commentaire" />
										</div>
									</td>
									<td scope="CRITICITY_GLOBAL" size="small"></td>
									<td scope="RISQUE_QUALITATIF_ELEC" class="ADMIN Number" size="small"></td>
									<td scope="RISQUE_QUALITATIF_CPST" class="ADMIN Number" size="small"></td>
									<td scope="RISQUE_QUALITATIF_ASSEMBLY" class="ADMIN Number" size="small"></td>
									<td scope="RISQUE_QUALITATIF_RAD" class="ADMIN Number" size="small"></td>
									<td scope="MONOSOURCES" class="ADMIN Number" size="small"></td>
									<td scope="ORIGIN_US" class="ADMIN Number" size="small"></td>
									<td scope="ETCA" class="ADMIN Number" size="small"></td>
									<td scope="OQD" class="ADMIN Number" size="small"></td>
									<td scope="OTD" class="ADMIN Number" size="small"></td>
									<td scope="MAT_TECH" class="ADMIN Number" size="medium"></td>
									<td scope="RISQUE_TRI" class="ADMIN Number" size="small"></td>
									<td scope="RISQUE_SOCIETE" class="ADMIN Number" size="small"></td>
									<td scope="CRITICITY_HANDLING_STORAGE" class="ADMIN Number" size="medium"></td>
									<td scope="REMEDE" class="ADMIN Text" size="large">
										<p odlValue="test"></p>
											<div style="display: none;">
												<input type="text" />
											</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					
					<div class="containerButton2">
						<input type="button" value="Valider" id="validComponent" />
						<span></span>
						<input type="button" value="Annuler" id="annulComponent" />
					</div>
					
				</div>
				
				<div style="margin-top: 45px;">
					<h2>Sources</h2>
					<div id="SourcesContainer">
						<table id="SourcesTable" border="0" cellpadding="0" cellspacing="0">
							<thead>
								<tr>
									<th scope="SOURCE" size="medium">SOURCE</th>
									<th scope="VERSION" size="medium">VERSION</th>
									<th scope="QUALITE" size="medium">QUALITE</th>
									<th scope="MANUF_CODE" size="medium">MANUF_CODE</th>
									<th scope="MANUF_NAME" size="large">MANUF_NAME</th>
									<th scope="MANUF_TOWN" size="medium">MANUF_TOWN</th>
									<th scope="MANUF_COUNTRY" size="medium">MANUF_COUNTRY</th>
									<th scope="CAGE_CODE" size="medium">CAGE_CODE</th>
									<th scope="GENER_SPEC" size="medium">GENER_SPEC</th>
									<th scope="DETAIL_SPEC" size="large">DETAIL_SPEC</th>
									<th scope="AMEND_SPEC" size="medium">AMEND_SPEC</th>
									<th scope="STATE" size="medium">STATE</th>
								</tr>
							</thead>
							<tbody>
								<tr class="trClonable">
									<td scope="SOURCE"></td>
									<td scope="VERSION"></td>
									<td scope="QUALITE"></td>
									<td scope="MANUF_CODE"></td>
									<td scope="MANUF_NAME"></td>
									<td scope="MANUF_TOWN"></td>
									<td scope="MANUF_COUNTRY"></td>
									<td scope="CAGE_CODE"></td>
									<td scope="GENER_SPEC"></td>
									<td scope="DETAIL_SPEC"></td>
									<td scope="AMEND_SPEC"></td>
									<td scope="STATE"></td>
								</tr>
								
								<tr>
									<td scope="SOURCE"></td>
									<td scope="VERSION"></td>
									<td scope="QUALITE"></td>
									<td scope="MANUF_CODE"></td>
									<td scope="MANUF_NAME"></td>
									<td scope="MANUF_TOWN"></td>
									<td scope="MANUF_COUNTRY"></td>
									<td scope="CAGE_CODE"></td>	
									<td scope="GENER_SPEC"></td>
									<td scope="DETAIL_SPEC"></td>
									<td scope="AMEND_SPEC"></td>
									<td scope="STATE"></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div >
				
				<div id="divQuickUpdate" style="margin-top: 45px; display:none;">
					<h2>Modification Rapide</h2>
					<form id="quickUpdate" class="autoComplete" AUTOCOMPLETE=OFF>
						<div class="div01">
							Colonne à changer
							<input type="text" id="quickUpdateColumn"/>
						</div class="div01">
						<div class="div01">
							Valeur
							<input type="number" id="quickUpdateValueNumber" min="0" max="5"/>
							<input type="text" id="quickUpdateValueText" style="display: none"/>
						</div>
						<div class="inline">
							<span class="horizontal"></span>
							<input type="submit" id="quickUpdateSubmit" value="Valider"/>
							<span class="vertical"></span>
							<input type="button" id="quickUpdateAnnul" value="Annuler"/>
						</div>
					</form>
				</div>
				
				
			</div>
			
			<div id="preferences" style="display : none">
				<h2>Préférences</h2>
				<p> Veuillez sélectionner les colonnes que vous souhaitez visualiser </p>
				<h3>Tableau</h3>
				<div id='listInputPreferencesTab'></div>
				<h3>Composant</h3>
				<div id='listInputPreferencesComp'></div>
				<h3>Sources</h3>
				<div id='listInputPreferencesSources'></div>
			</div>
			
			<!--
			<div id="login" style="display : none">
				<h2>Connexion</h2>
				<form>
					<span>Identifiant</span>
					<input type="text" id="login_id"/> <br/>
					<span>Mot de passe</span>
					<input type="password" id="login_mdp"/><br/>
					<input class="submit" id="login_submit" type="button" value="connexion"/>
				</form>
			</div>
			-->
			<div class="footer">
				<div style="height:100px; display:block;"></div>
				<img src="assets/image/logo Thales Alenia Space-Leonardo.jpg" alt="logo" width="179" height="72" style="padding-left:75%;">
				<div style="height:100px; display:block;"></div>
			</div>
				
			
			<script src="assets/js/jquery-v3.3.1.min.js"></script>
			<script src="assets/js/autocomplete.js"></script>
			<script src="assets/js/main.js"></script>
			
		</div>
	</body>
</html>