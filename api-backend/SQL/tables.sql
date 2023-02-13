CREATE TABLE Member(
		member_id char(5),
        mstatus char(1),
        First_Name varchar(20) not null,
        Last_Name varchar(20) not null,
        email varchar(50),
        password varchar(50),
        Gender varchar(20),
        Date_of_Birth varchar(10) not null,
        primary key (member_id)
        );
    
CREATE TABLE question(
	qid char(8),
    qtext varchar(50),
    required char(5),
    qtype char(10),
    primary key (qid)
    );
    
CREATE TABLE questionnaire_form(
	questionnaire_id char(5),
    questionnaire_title varchar(50),
    keywords varchar(50),
    member_id char(5),
    primary key (questionnaire_id),
    foreign key (member_id) references Member(member_id)
		ON DELETE CASCADE
    );

CREATE TABLE keyword(
	key_word char(20),
    questionnaire_id char(5),
    primary key (key_word),
    foreign key (questionnaire_id) references questionnaire_form(questionnaire_id)
		ON DELETE CASCADE
    );

CREATE TABLE _options(
	optid char(10),
    opttext varchar(50),
    nextqid char(8),
    primary key (optid)
    );

CREATE TABLE questionnaire_answer(
	_session char(4),
    questionnaire_id char(5),
    primary key (_session),
    foreign key (questionnaire_id) references questionnaire_form(questionnaire_id)
		ON DELETE CASCADE
    );
	
CREATE TABLE form_opt_and_questions(
	questionnaire_id char(5),
	qid char(8),
    optid char(10),
    primary key (questionnaire_id,qid,optid),
    foreign key (questionnaire_id) references questionnaire_form(questionnaire_id)
		ON DELETE CASCADE,
    foreign key (qid) references question(qid),
    foreign key (optid) references _options(optid)
    );

CREATE TABLE ans_consist_of (
	_session char(4),
    qid char(8),
    optid char(10),
     primary key (_session,qid,optid),
     foreign key (_session) references questionnaire_answer(_session)
		ON DELETE CASCADE,
    foreign key (qid) references question(qid),
    foreign key (optid) references _options(optid)
    );

/* Changed length of qtext */
ALTER TABLE `intelliq22`.`question` 
CHANGE COLUMN `qtext` `qtext` VARCHAR(100) NULL DEFAULT NULL ;
