import subprocess
import os

script_path = os.path.abspath('se2207.py')


#Healthcheck Commands
#./se2207.py healthcheck --format csv
healthcheck_csv_command = ['python', 'se2207.py', 'healthcheck', '--format', 'csv']
#./se2207.py healthcheck --format json
healthcheck_json_command = ['python','se2207.py', 'healthcheck','--format', 'json']

result = subprocess.run(healthcheck_csv_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
print(result.stdout.decode())
result = subprocess.run(healthcheck_json_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
print(result.stdout.decode())


#Show Questionnaire Commands (1) (QQ000)
#./se2207 questionnaire --questionnaire_id QQ000 --format csv
questionnaire_csv_command_1 = ['python', 'se2207.py', 'questionnaire', '--questionnaire_id', 'QQ000', '--format', 'csv']
#./se2207 questionnaire --questionnaire_id QQ000 --format json
questionnaire_json_command_1 = ['python', 'se2207.py', 'questionnaire', '--questionnaire_id', 'QQ000', '--format', 'json']      

result = subprocess.run(questionnaire_csv_command_1, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
print(result.stderr.decode())

print(result.stdout.decode())
result = subprocess.run(questionnaire_json_command_1, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
print(result.stdout.decode())


#Answer Questionnaire Commands (QQ000)
#doanswer_command_q0 = ['python','se2207.py','doanswer','--questionnaire_id','QQ000','--question_id','P00','--session_id','KAPA','--option_id','P00TXT']
#./se2207 doanswer --questionnaire_id QQ004 --question_id P01 --session_id KAPA --option_id P01A1
doanswer_command_q1 = ['python','se2207.py','doanswer','--questionnaire_id','QQ004','--question_id','P01','--session_id','KAPA','--option_id','P01A1']
#./se2207 doanswer --questionnaire_id QQ004 --question_id P02 --session_id KAPA --option_id P02A1

doanswer_command_q2 = ['python','se2207.py','doanswer','--questionnaire_id','QQ004','--question_id','Q01','--session_id','KAPA','--option_id','Q01A1']
#./se2207 doanswer --questionnaire_id QQ004 --question_id Q01 --session_id KAPA --option_id Q01A1

doanswer_command_q3 = ['python','se2207.py','doanswer','--questionnaire_id','QQ004','--question_id','Q02','--session_id','KAPA','--option_id','Q02A1']
#./se2207 doanswer --questionnaire_id QQ004 --question_id Q02 --session_id KAPA --option_id Q02A1
#./se2207 doanswer --questionnaire_id QQ004 --question_id Q03 --session_id KAPA --option_id Q03A1
#./se2207 doanswer --questionnaire_id QQ004 --question_id Q04 --session_id KAPA --option_id Q04A1
#./se2207 doanswer --questionnaire_id QQ004 --question_id Q05 --session_id KAPA --option_id Q05A1
#./se2207 doanswer --questionnaire_id QQ004 --question_id Q06 --session_id KAPA --option_id Q06A1
#./se2207 doanswer --questionnaire_id QQ004 --question_id Q07 --session_id KAPA --option_id Q07A1
#./se2207 doanswer --questionnaire_id QQ004 --question_id Q08 --session_id KAPA --option_id Q08A1


#result = subprocess.run(doanswer_command_q0, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
#print(result.stdout.decode())
result = subprocess.run(doanswer_command_q1, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
print(result.stdout.decode())
result = subprocess.run(doanswer_command_q2, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
print(result.stdout.decode())
result = subprocess.run(doanswer_command_q3, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
print(result.stdout.decode())

#Question  Answers Commands
#./se2207 getquestionanswers --questionnaire_id QQ004 --question_id Q01 --format csv
#./se2207 getquestionanswers --questionnaire_id QQ004 --question_id Q01 --format json

getquestionanswer_csv_command = ['python','se2207.py','getquestionanswers','--questionnaire_id','QQ004','--question_id','Q01','--format','csv' ]
getquestionanswer_json_command = ['python','se2207.py','getquestionanswers','--questionnaire_id','QQ004','--question_id','QQ004Q01','--format','json' ]

result = subprocess.run(healthcheck_csv_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
print(result.stdout.decode())
result = subprocess.run(healthcheck_csv_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
print(result.stdout.decode())

# ResetAll commands
#./se2207 resetall --format csv
#./se2207 resetall --format json

resetall_csv_command = ['python','se2207.py','resetall','--format','csv']
resetall_json_command = ['python','se2207.py','resetall','--format','json']

result = subprocess.run(healthcheck_csv_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
print(result.stdout.decode())
result = subprocess.run(healthcheck_csv_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
print(result.stdout.decode())

#Questionnaire Upload Command
#./se2207 questionnaireupd --source cli_test.txt
questionnaire_upd_command = ['./se2207','questionnaireupd','--source','cli-test.txt'] 

result = subprocess.run(healthcheck_csv_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
print(result.stdout.decode())


#Show Questionnaire Commands (2) (QQ001)
questionnaire_csv_command_2 = ['python','se2207.py','questionnaire','--questionnaire_id','QQ001','--format','csv']
questionnaire_json_command_2 = ['python','se2207.py','questionnaire','--questionnaire_id','QQ001','--format','json']      

result = subprocess.run(healthcheck_csv_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
print(result.stdout.decode())
result = subprocess.run(healthcheck_csv_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
print(result.stdout.decode())

# Run the command using subprocess
result = subprocess.run(healthcheck_csv_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# Print the result
print(result.stdout.decode()) 