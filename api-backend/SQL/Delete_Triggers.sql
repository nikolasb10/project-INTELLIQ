         /* DELETE TRIGGERS */
/* Delete Questionnaire */
delimiter //
CREATE TRIGGER questionnaire_delete 
	AFTER DELETE ON questionnaire_form
    FOR EACH ROW
	BEGIN
		-- Disable foreign key checks
		SET FOREIGN_KEY_CHECKS = 0;
		-- Delete related rows in other tables
	    DELETE FROM questionnaire_answer WHERE questionnaire_id = OLD.questionnaire_id;
	    DELETE FROM ans_consist_of WHERE qid IN ( 
			SELECT qid FROM form_opt_and_questions
				WHERE questionnaire_id = OLD.questionnaire_id);
	    DELETE FROM question WHERE qid IN ( 
			SELECT qid FROM form_opt_and_questions
				WHERE questionnaire_id = OLD.questionnaire_id);
		DELETE FROM _options WHERE optid IN (
			SELECT optid FROM form_opt_and_questions
				WHERE questionnaire_id = OLD.questionnaire_id);
		DELETE FROM keyword WHERE questionnaire_id = OLD.questionnaire_id;
	    DELETE FROM form_opt_and_questions WHERE questionnaire_id = OLD.questionnaire_id;
		-- Re-enable foreign key checks
		SET FOREIGN_KEY_CHECKS = 1;
	END;//
delimiter ;

/* Delete Member */
delimiter //
CREATE TRIGGER Member_delete 
	AFTER DELETE ON Member
    FOR EACH ROW
	BEGIN
    DELETE FROM questionnaire_answer WHERE questionnaire_id IN ( 
		SELECT questionnaire_id FROM questionnaire_form
			WHERE member_id = OLD.member_id);
    DELETE FROM ans_consist_of WHERE qid IN ( 
		SELECT qid FROM form_opt_and_questions
			WHERE questionnaire_id IN ( 
				SELECT questionnaire_id FROM questionnaire_form
					WHERE member_id = OLD.member_id));
    DELETE FROM question WHERE qid IN ( 
		SELECT qid FROM form_opt_and_questions
			WHERE questionnaire_id IN ( 
				SELECT questionnaire_id FROM questionnaire_form
					WHERE member_id = OLD.member_id));
	DELETE FROM _options WHERE optid IN (
		SELECT optid FROM form_opt_and_questions
			WHERE questionnaire_id IN ( 
				SELECT questionnaire_id FROM questionnaire_form
					WHERE member_id = OLD.member_id));
	DELETE FROM keyword WHERE questionnaire_id IN ( 
		SELECT questionnaire_id FROM questionnaire_form
			WHERE member_id = OLD.member_id);
    DELETE FROM form_opt_and_questions WHERE questionnaire_id IN ( 
		SELECT questionnaire_id FROM questionnaire_form
			WHERE member_id = OLD.member_id);
END;//
delimiter ;

delimiter //
CREATE TRIGGER question_delete_check
BEFORE DELETE ON question
FOR EACH ROW
BEGIN
  IF EXISTS (SELECT 1 FROM form_opt_and_questions WHERE qid = OLD.qid) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot delete question used in questionnaire.';
  END IF;
END;//
delimiter ;

delimiter //
CREATE TRIGGER keyword_delete_check
BEFORE DELETE ON keyword
FOR EACH ROW
BEGIN
  IF EXISTS (SELECT 1 FROM questionnaire_form WHERE questionnaire_id = OLD.questionnaire_id) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot delete keyword used in questionnaire.';
  END IF;
END;
delimiter ;