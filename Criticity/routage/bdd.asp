<!--#include virtual="/__ETCA_Security/check_permissions.asp" -->	
<!--#include file="../lib/json2.asp"-->
<%
	
	
	dim req, method
	req = request("type") 'request.querystring("type")
	method = request.ServerVariables("REQUEST_METHOD")
	dim conn
	
	' Utiliser la ConnectionString : 
			'ConnectionString = "Driver={Oracle in instantclient10_2};Dbq=APP_D;Uid=CRITCOMPO;Pwd=CRITICIT;"
	
		
	
	if req = "component" then 
		dim id
		id = request.querystring("id")
		
		getConnexion()
		
		
		response.write("{")
			response.write("""Part-Number"" : """ +id+"""")
			
			response.write(", ""PACL"" : [")
				dim rq
				'' *** Only PACL into Criticity Table
				rq = "Select PACL_NOM from PACL, CRITICITE  where ARTICLE = S3E_NUMBER and ARTICLE = '"+id+"'" 
				set rs = server.createobject("ADODB.RecordSet")
				rs.open rq, conn
			
				dim first
				first = true
				while rs.EOF=false
					if first then
						response.write("""" + rs.Fields.item("PACL_NOM").value + """")
						first = false
					else 
						response.write(", """ + rs.Fields.item("PACL_NOM").value + """")
					end if
					rs.MoveNext
				wend
				rs.close
			response.write("] ")
			
				
			
			'Table principale : CRITICITE ! 
			rq = "Select TEXT_COMMENT, CRITICITY_GLOBAL, RISQUE_QUALITATIF_ELEC, RISQUE_QUALITATIF_CPST, RISQUE_QUALITATIF_ASSEMBLY, RISQUE_QUALITATIF_RAD, MONOSOURCES, ORIGIN_US, ETCA, OQD, RISQUE_TRI, RISQUE_SOCIETE, CRITICITY_HANDLING_STORAGE, REMEDE, OTD, MAT_TECH"
			rq = rq + " from CRITICITE, COMMENT_ICS where CRITICITE.S3E_NUMBER = '"+id+"' and COMMENT_ICS.S3E_NUMBER(+) = CRITICITE.S3E_NUMBER and LAST_COMMENT(+) = '1'" 
			dim rs2
			set rs2 = server.createobject("ADODB.RecordSet")
			rs2.open rq, conn
			
			if not rs2.EOF then
				for each x in rs2.Fields
					response.write(" , """ + x.name + """ : " + JSON.stringify(x.value))
				next
			end if
			
			'//TODO: Récupérer les différentes sources Active
			response.write(", ""SOURCES"" : [")
				rq = "Select distinct * From SOURCES where ARTICLE = '" + id + "'"
				dim rs3
				set rs3 = server.createobject("ADODB.RecordSet")
				rs3.open rq, conn
				
				first = true
				while rs3.EOF=false
					if first then
						first = false
					else
						response.write(", ")
					end if
					response.write("{")
					first2 = true
					for each x in rs3.Fields
						if first2 then
							response.write("""" + x.name + """ : " + JSON.stringify(x.value))
							first2 = false
						else
							response.write(" , """ + x.name + """ : " + JSON.stringify(x.value))
						end if
					next
					response.write("}")
					rs3.MoveNext
				wend
				rs3.close
			response.write("]")
			
		response.write("}")
		response.end
		conn.close
		
	end if
	
	if req = "getRows" then 
		dim filter, StrSql
		filter = request.querystring("filter")
		set filter = JSON.parse(filter)
		
		
		getConnexion()
		
        Dim recordset
		' //TODO: Changer la requête principale !!! 
		StrSql = "Select distinct CRITICITE.S3E_NUMBER, S3E_VERSION, I3EP_DESCRIPTION, I3EP_FAMILY_CODE, I3EP_GROUP_CODE, PACL.GRADE, I3EP_PACKAGE, MATURITY, I3E_PLCSTATVAL, I3EP_PPL, I3EP_EXPORT_IS, I3EP_NS_CATEGORY, I3EP_CRITICALITY, I3EP_ESD_STATUS, I3EP_MSL, LEADTIME, CRITICITY_GLOBAL "
		StrSql =  StrSql + "from PACL, CRITICITE, PCDB_INFOS_3E, COMMENT_ICS, PPL where (PACL.ARTICLE(+) = CRITICITE.S3E_NUMBER) and (CRITICITE.S3E_NUMBER = PCDB_INFOS_3E.S3E_NUMBER(+)) and (CRITICITE.S3E_NUMBER = COMMENT_ICS.S3E_NUMBER(+)) and (CRITICITE.S3E_NUMBER = PPL.SDT_NUMBER(+))"
			
		' *** Ajout des filtres ***
			
		StrSql = StrSql + getFilter(filter)
		'response.write(StrSql)
		
        set recordset = server.createobject("ADODB.RecordSet")
        recordset.open StrSql, conn
		
		
		'retourner les datas au bon format
		dim mime
		mime = request.querystring("mime")
		if mime = "html" or mime = "" then
			while recordset.EOF=false
				response.write("<tr>")
				for each x in recordset.Fields
					response.write("<td scope="+x.name+">"&x.value&"</td>")
				next			
				response.write("</tr>")
				recordset.MoveNext
			wend
		end if
		if mime = "json" then
			response.write("[")
			first1 = true
			while recordset.EOF=false
				if first1 then
					first1 = false
				else
					response.write(" , ")
				end if
				response.write("{")
				first2 = true
				for each x in recordset.Fields
					if first2 then
						response.write(""""+x.name+""" : " + JSON.stringify(x.value))
						first2 = false
					else
						response.write(" , """+x.name+""" : "+JSON.stringify(x.value))
					end if
					'if true then 
					'	response.write("   ???    " + x.name + " => " + x.value + "   !!!    " )
					'end if 
				next			
				response.write("}")
				recordset.MoveNext
			wend
			response.write("]")
		end if
		response.end
		recordset.Close
        conn.Close	
	end if
	
	
	if req = "addComment" then
		if Canviewlevel(2)  then '//ICS
			'dim id, val
			id = request("id")
			val = request("val")
			
			
			response.write(val)
			
			getConnexion()
			
			set comm=Server.CreateObject("ADODB.command")
			comm.ActiveConnection=conn
			comm.CommandText="insertComment"
			set param1 = comm.CreateParameter
				param1.Name ="user_id"
				param1.type = 129				'adChar
				param1.Direction = 1			'adParamInput
				param1.Size = -1				'adCmdUnspecified
				param1.Value = session("USERNAME")
				
			comm.Parameters.Append param1
			comm.Parameters.Append comm.CreateParameter("part_number", 129, 1, -1, id)
			comm.Parameters.Append comm.CreateParameter("text", 129, 1, -1, val)
			comm.Execute
			
		else
			response.Status="401 Unauthorized"
			response.write("You need to be ICS User for this operation")
		end if
		response.end
	end if
	
	if req = "updateCriticity" then '//Plus  utilisé normalement
		if Canviewlevel(3) then '// Admin
			'dim id, val
			id = request("id")
			val = request("value")
			scope = request("scope")
			
			
			getConnexion()
			
			set comm=Server.CreateObject("ADODB.command")
			comm.ActiveConnection=conn
			comm.CommandText="UPDATE_CRITICITY"
			set param1 = comm.CreateParameter
				param1.Name ="ARTICLE"
				param1.type = 129				'adChar
				param1.Direction = 1			'adParamInput
				param1.Size = -1				'adCmdUnspecified
				param1.Value = id
				
			comm.Parameters.Append param1
			comm.Parameters.Append comm.CreateParameter("COL", 129, 1, -1, scope)
			comm.Parameters.Append comm.CreateParameter("VAL", 129, 1, -1, val)
			comm.Execute
			
			'retourner la nouvelle Criticité_Global
			StrSql = "Select CRITICITY_GLOBAL from CRITICITE where S3E_NUMBER = '" + id + "'"
			set mvarRecl = server.createobject("ADODB.RecordSet")
			mvarRecl.open StrSql, conn
			
			response.write("{""CRITICITY_GLOBAL"" : " + JSON.stringify(mvarRecl.Fields.item("CRITICITY_GLOBAL").value) + "}")
			mvarRecl.close
			conn.close
		else
			response.Status="401 Unauthorized"
			response.write("You need to be ADMIN for this operation")
		end if
		response.end
	end if
	
	if req = "updateCriticity2" then
		if Canviewlevel(3) then
			dim values, setcmd
			id = request("id")
			values = request("values")
			set values = JSON.parse(values)
			setcmd = ""
			first = true
			for each key in values.keys()
				if first then
					first = false
				else 
					setcmd = setcmd + ", "
				end if
				setcmd = setcmd + key + " = '" + values.get(key) + "'"
			next
			
			getConnexion()
			
			set comm=Server.CreateObject("ADODB.command")
			comm.ActiveConnection=conn
			comm.CommandText="UPDATE CRITICITE SET " + setcmd + "WHERE S3E_NUMBER = '" + id +"'"
			'response.write(comm.CommandText)
			comm.Execute
			
			'retourner la nouvelle Criticité_Global
			StrSql = "Select CRITICITY_GLOBAL from CRITICITE where S3E_NUMBER = '" + id + "'"
			set mvarRecl = server.createobject("ADODB.RecordSet")
			mvarRecl.open StrSql, conn
			
			response.write("{""CRITICITY_GLOBAL"" : " + JSON.stringify(mvarRecl.Fields.item("CRITICITY_GLOBAL").value) + "}")
			mvarRecl.close
			conn.close
		else
			response.Status="401 Unauthorized"
			response.write("You need to be ADMIN for this operation")
		end if
		response.end
	end if
	
	if req = "search" then
		dim nameColumn, table
		table = request.querystring("table")
		nameColumn = request.querystring("nameColumn")
		val = request.querystring("val")
		
		getConnexion()
	 
		StrSql = "Select distinct " + nameColumn +" from " + table + " where " + nameColumn + " like '" + val + "%'"
		set mvarRecl = server.createobject("ADODB.RecordSet")
        mvarRecl.open StrSql, conn
		
		response.write("[")
			first = true
			while mvarRecl.EOF=false
				if first then
					first = false
				else
					response.write(", ")
				end if
				response.write(JSON.stringify(mvarRecl.Fields.item(0).value ))
				mvarRecl.MoveNext
			wend
			mvarRecl.close
		response.write("]")
		conn.close
		response.end
	end if
	
	
	if req = "multi-update" then
		dim column, value
		table = request("table")
		column = request("column")
		value = request("value")
		filter = request("filter")
		set filter = JSON.parse(filter)
		
		dim s3e, exec, actualDate
		s3e = "Select CRITICITE.S3E_NUMBER "
		s3e =  s3e + "from PACL, CRITICITE, PCDB_INFOS_3E where (PACL.ARTICLE(+) = CRITICITE.S3E_NUMBER) and (CRITICITE.S3E_NUMBER = PCDB_INFOS_3E.S3E_NUMBER(+))"
		s3e = s3e + getFilter(filter)
		actualDate = now()
		getConnexion()
		'response.write(String(actualDate))
		
		if table = "COMMENT_ICS" and column = "TEXT_COMMENT" and canViewLevel(2) then
			'response.write(getFilter(filter))
			
			'//TODO: à finir dans oracle
			getConnexion()
			
			set comm=Server.CreateObject("ADODB.command")
			comm.ActiveConnection=conn
			
			comm.CommandText="TEST_EXECUTE"
			comm.Parameters.Append comm.CreateParameter("Filtre", 129, 1, -1, getFilter(filter))
			set param1 = comm.CreateParameter
				param1.Name ="TEXT"
				param1.type = 129				'adChar
				param1.Direction = 1			'adParamInput
				param1.Size = -1				'adCmdUnspecified
				param1.Value = value
				
			comm.Parameters.Append param1
			
			comm.Parameters.Append comm.CreateParameter("ID_USER", 129, 1, -1, SESSION("USERNAME"))
			
			comm.Execute
			
			
			
		elseif table = "CRITICITE" and not column = "CRITICITY_GLOBAL" and canViewLevel(3) then
			exec = "UPDATE CRITICITE SET " + column + " = '" + value + "' , DATE_UPDATE = '" & actualDate & "', USER_UPDATE = '" + SESSION("USERNAME") + "' "
			exec = exec + "WHERE S3E_NUMBER IN (" + s3e + ");" 
			'// TODO rajouter des trigger dans la bdd pour la criticite globale
			response.write(exec)
			conn.Execute exec
			
		else
			response.Status="401 Unauthorized"
			response.write("Unauthorized : Request incorrect or insufficient right")
		end if
		
		conn.close
		
	end if
	
	
	function getConnexion()
		ConnectionString = "Driver={Oracle in instantclient10_2};Dbq=APP_D;Uid=CRITCOMPO;Pwd=CRITICIT;"
		set conn =server.CreateObject ("ADODB.Connection")
		conn.CommandTimeout = 15
		conn.ConnectionTimeout = 15
		conn.Open ConnectionString
	end function
	
	function getFilter(filter)
		dim firstAnd, firstOr, StrSql
		StrSql = ""
		firstAnd = false
		for each key in filter.keys()
			firstOr = true
			if not firstAnd then
				StrSql = StrSql + " AND ("
			else 
				StrSql = StrSql + " WHERE ("
				firstAnd = false
			end if
			for each x in filter.get(key)
				if not x.get(0) = "" then
					dim index0, index1
					index0 = x.get(0)
					index1 = x.get(1)
					if index0 = "like" then
						index1 = "%" + index1 + "%"
					end if
					if firstOr then
						StrSql = StrSql + key + " " + index0 + " '" + index1 + "'"
						firstOr = false
					else
						StrSql = StrSql + " OR " + key + " " + index0 + " '" + index1 + "'"
					end if
				end if
			next
			StrSql = StrSql + ") "
		next
		getFilter = StrSql
	end function
	
	
%>