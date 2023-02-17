import subprocess

#Healthcheck Commands
healthcheck_csv_command = ['./se2207', 'healthcheck','--format', 'csv']
healthcheck_json_command = ['./se2207', 'healthcheck','--format', 'json']

#Show Questionnaire Commands (1) (QQ000)
questionnaire_csv_command_1 = ['./se2207','questionnaire','--questionnaire_id','QQ000','--format','csv']
questionnaire_json_command_1 = ['./se2207','questionnaire','--questionnaire_id','QQ000','--format','json']      

#Answer Questionnaire Commands (QQ000)
doanswer_command_q0 = ['./se2207','doanswer','--questionnaire_id','QQ000','--question_id','P00','--session_id','KAPA','--option_id','P00TXT']
doanswer_command_q1 = ['./se2207','doanswer','--questionnaire_id','QQ000','--question_id','P01','--session_id','KAPA','--option_id','P01A1']
doanswer_command_q2 = ['./se2207','doanswer','--questionnaire_id','QQ000','--question_id','Q01','--session_id','KAPA','--option_id','Q01A1']
doanswer_command_q3 = ['./se2207','doanswer','--questionnaire_id','QQ000','--question_id','Q02','--session_id','KAPA','--option_id','Q02A1']
#Question  Answers Commands
getquestionanswer_csv_command = ['./se2207','getquestionanswers','--questionnaire_id','QQ000','--question_id','QQ000Q01','--format','csv' ]
getquestionanswer_json_command = ['./se2207','getquestionanswers','--questionnaire_id','QQ000','--question_id','QQ000Q01','--format','json' ]

# ResetAll commands
resetall_csv_command = ['./se2207','resetall','--format','csv']
resetall_json_command = ['./se2207','resetall','--format','json']

#Questionnaire Upload Command
questionnaire_upd_command = ['./se2207','questionnaireupd','--source','cli-test.txt'] 


#Show Questionnaire Commands (2) (QQ001)
questionnaire_csv_command_2 = ['./se2207','questionnaire','--questionnaire_id','QQ001','--format','csv']
questionnaire_json_command_2 = ['./se2207','questionnaire','--questionnaire_id','QQ001','--format','json']      

# Run the command using subprocess
result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# Print the result
print(result.stdout.decode())