
<%
	dim login
	dim password
	dim user
	login = request("login")
	password = request("password")
	user = true	
	'TODO : connecter à wach
	If user Then 
		Session("USER") = login
		if login = "louis" then
			Session("ICS_USER") = true
			Session("ADMIN") = true
		else
			Session("ICS_USER") = false
			Session("ADMIN") = false
		end if
	Else 
		
	End If
		
%>
