function niExit()
{
	var SD = window.opener;
	
	var answer = confirm("Are You Sure You Wish To Exit This Course?");
		
	if(answer)
	{
		SD.ConcedeControl();
		window.close();
	}
}