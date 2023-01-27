        /* DELETE TRIGGERS */
/* Delete Questionnaire */
delimiter //
CREATE TRIGGER questionnaire_delete 
	AFTER DELETE ON questionnaire_form
    FOR EACH ROW
	BEGIN
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