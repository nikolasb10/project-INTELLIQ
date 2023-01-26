CREATE TABLE Member(
		member_id char(5),
        mstatus char(1),
        First_Name varchar(20) not null,
        Last_Name varchar(20) not null,
        email varchar(50),
        Gender varchar(20),
        Date_of_Birth varchar(10) not null,
        primary key (member_id)
        );
    
CREATE TABLE question(
	qid char(5),
    qtext varchar(50),
    required char(1),
    qtype char(1),
    primary key (qid)
    );
    
CREATE TABLE questionnaire_form(
	questionnaire_id char(5),
    questionnaire_title varchar(25),
	keywords varchar(50),
    member_id char(5),
    primary key (questionnaire_id),
    foreign key (member_id) references Member(member_id)
    );

CREATE TABLE keyword(
	key_word char(20),
    questionnaire_id char(5),
    primary key (key_word),
    foreign key (questionnaire_id) references questionnaire_form(questionnaire_id)
    );

CREATE TABLE _options(
	optid char(5),
    opttext varchar(50),
    nextqid char(5),
    primary key (optid)
    );

CREATE TABLE questionnaire_answer(
	_session char(4),
    questionnaire_id char(5),
    primary key (_session),
    foreign key (questionnaire_id) references questionnaire_form(questionnaire_id)
    );
	
CREATE TABLE form_opt_and_questions(
	questionnaire_id char(5),
	qid char(5),
    optid char(5),
    primary key (questionnaire_id,qid,optid),
    foreign key (questionnaire_id) references questionnaire_form(questionnaire_id),
    foreign key (qid) references question(qid),
    foreign key (optid) references _options(optid)
    );

CREATE TABLE ans_consist_of (
	_session char(4),
    qid char(5),
    optid char(5),
     primary key (_session,qid,optid),
     foreign key (_session) references questionnaire_answer(_session),
    foreign key (qid) references question(qid),
    foreign key (optid) references _options(optid)
    );

-- Alter of title length
ALTER TABLE `intelliq22`.`questionnaire_form` 
CHANGE COLUMN `questionnaire_title` `questionnaire_title` VARCHAR(50) NULL DEFAULT NULL ;

-- Drop of keywors column from questionnaire form
ALTER TABLE `intelliq22`.`questionnaire_form` 
DROP COLUMN `keywords`;

-- Alter lengths
ALTER TABLE `intelliq22`.`question` 
CHANGE COLUMN `required` `required` CHAR(5) NULL DEFAULT NULL ,
CHANGE COLUMN `qtype` `qtype` CHAR(10) NULL DEFAULT NULL ;

-- Alter opt_id length
ALTER TABLE `intelliq22`.`form_opt_and_questions` 
DROP FOREIGN KEY `form_opt_and_questions_ibfk_3`;
ALTER TABLE `intelliq22`.`form_opt_and_questions` 
CHANGE COLUMN `optid` `optid` CHAR(6) NOT NULL ;
ALTER TABLE `intelliq22`.`form_opt_and_questions` 
ADD CONSTRAINT `form_opt_and_questions_ibfk_3`
  FOREIGN KEY (`optid`)
  REFERENCES `intelliq22`.`_options` (`optid`);

ALTER TABLE `intelliq22`.`ans_consist_of` 
DROP FOREIGN KEY `ans_consist_of_ibfk_3`;
ALTER TABLE `intelliq22`.`ans_consist_of` 
CHANGE COLUMN `optid` `optid` CHAR(6) NOT NULL ;
ALTER TABLE `intelliq22`.`ans_consist_of` 
ADD CONSTRAINT `ans_consist_of_ibfk_3`
  FOREIGN KEY (`optid`)
  REFERENCES `intelliq22`.`_options` (`optid`);

ALTER TABLE `intelliq22`.`ans_consist_of` 
DROP FOREIGN KEY `ans_consist_of_ibfk_3`;
ALTER TABLE `intelliq22`.`ans_consist_of` 
DROP INDEX `ans_consist_of_ibfk_3` ;
;

ALTER TABLE `intelliq22`.`_options` 
CHANGE COLUMN `optid` `optid` CHAR(6) NOT NULL ;


ALTER TABLE `intelliq22`.`ans_consist_of` 
ADD INDEX `ans_consist_of_ibfk_3_idx` (`optid` ASC) VISIBLE;
;
ALTER TABLE `intelliq22`.`ans_consist_of` 
ADD CONSTRAINT `ans_consist_of_ibfk_3`
  FOREIGN KEY (`optid`)
  REFERENCES `intelliq22`.`_options` (`optid`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
ALTER TABLE `intelliq22`.`form_opt_and_questions` 
ADD INDEX `form_opt_and_questions_ibfk_3_idx` (`optid` ASC) VISIBLE;
;
ALTER TABLE `intelliq22`.`form_opt_and_questions` 
ADD CONSTRAINT `form_opt_and_questions_ibfk_3`
  FOREIGN KEY (`optid`)
  REFERENCES `intelliq22`.`_options` (`optid`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


