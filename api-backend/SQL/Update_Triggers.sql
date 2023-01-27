/*UPDATE  TRIGGERS*/ 
/*Member email Update*/
 delimiter //   
	CREATE TRIGGER Member_mail_upd BEFORE UPDATE ON Member 
	FOR EACH ROW
	 BEGIN 
	  IF (NEW.email  IN(
	   SELECT email FROM Member))
	   THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT ='Email already Exists';
	   END IF;
	   END;//
	   delimiter ;



    /*Questionnaire Update Title*/ 
	delimiter //
	CREATE TRIGGER Questionnaire_title_upd BEFORE UPDATE on questionnaire_form
	 FOR EACH ROW
	 BEGIN 
	  IF (NEW.questionnaire_title  IN(
	   SELECT questionnaire_title FROM questionnaire_form))
	   THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT ='Questionnaire Title already Exists';
	   END IF;
	   END;//
	   delimiter ;
       
	/*Questionnaire Create*/
    delimiter //
	
    create trigger Questionnaire_Member_check BEFORE insert on questionnaire_form
	 for each row
	  IF (NEW.member_id  NOT IN (
	   SELECT member_id FROM Member)) 
	   THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT ='Member doesnt Exist';
	   END IF;
	   END;//
	   delimiter ;
