

<%

	dim data
	data = request("datas")

	Set fso = server.CreateObject("Scripting.FileSystemObject")
	'path = "../export_csv/"
	path = server.mappath("/upload/CRITICITY")
	
	'strFilePath = server.mappath("/upload/METRO") & "\" & StrFileName
	title = "Criticity_" + SESSION("USERNAME") + ".csv"

	'*** Création du fichier texte "c:\toto.txt"
	Set NewFichier = fso.CreateTextFile(path & "\"+title,TRUE)
	
	'*** Ecriture des données de la variable "data1" dans le fichier texte.
	NewFichier.WriteLine(data)

	'*** Destruction des objets
	Set fso = Nothing
	
	response.write("/upload/CRITICITY\" +title)
%>