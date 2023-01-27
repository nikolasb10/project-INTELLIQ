/*INSERT TRIGGERS*/
	
    /*NEW Questionnaire with same Title*/ 
	delimiter //
	CREATE TRIGGER Questionnaire_title_upd BEFORE INSERT on questionnaire_form
	 FOR EACH ROW
	 BEGIN 
	  IF (NEW.questionnaire_title  IN(
	   SELECT questionnaire_title FROM questionnaire_form))
	   THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT ='Questionnaire Title already Exists';
	   END IF;
	   END;//
	   delimiter ;
       
/*New Member email check*/
 delimiter //   
	CREATE TRIGGER Member_mail_cr BEFORE INSERT ON Member 
	FOR EACH ROW
	 BEGIN 
	  IF (NEW.email  IN(
	   SELECT email FROM Member))
	   THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT ='Email already Exists';
	   END IF;
	   END;//
	   delimiter ;