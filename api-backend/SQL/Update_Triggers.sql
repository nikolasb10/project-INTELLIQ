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

delimiter //
CREATE TRIGGER keyword_update_check
BEFORE UPDATE ON questionnaire_form
FOR EACH ROW
BEGIN
  IF NOT EXISTS (SELECT 1 FROM keyword WHERE questionnaire_id = NEW.questionnaire_id AND key_word IN (SELECT keywords FROM questionnaire_form WHERE questionnaire_id = NEW.questionnaire_id)) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid keywords.';
  END IF;
END;//
delimiter ;


 
 
  delimiter // 
 CREATE TRIGGER nextqid_update_check
BEFORE UPDATE ON _options
FOR EACH ROW
BEGIN
  IF NEW.nextqid NOT IN (SELECT qid FROM question) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid next question id.';
  END IF;
END;//
delimiter ; 