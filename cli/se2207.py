import sys
sys.path.append('./modules')
import click
import requests
import json 
import csv
import os
import io


logged_in = False
mstatuss = 0
mmember_id = None

#Create temp User Info json file
if os.path.exists("usr_details.json"):
    with open("usr_details.json", "r") as f:
        data = json.load(f)
        mstatuss = (data[0]["mstatus"])
        mmember_id = data[0]["member_id"]


if mmember_id is not None:
    logged_in = True


@click.group()
def cli():
    pass


#Login
#CHECKED
@cli.command()
@click.option('--username', '-u', prompt=False, help='Username for login.')
@click.option('--passw', '-p', prompt=False, hide_input=True, help='Password for login.')
def login(username,passw):
    global logged_in
    payload = {'username': username, 'password': passw}
    endpoint = "http://localhost:9103/intelliq_api/login"
    response = requests.post(endpoint, json=payload)
    if isinstance(response.json(), list):
        print("Logged In!")
        with open('usr_details.json', 'w') as f:
            json.dump(response.json(), f)
    else:     
        print(response.text)



#Health Check (#)
#CHECKED
@cli.command()
@click.option('--format', '-f', prompt=False, help='CSV or JSON.')
def healthcheck(format):
    if logged_in:
        if (mstatuss == 'a'):
            endpoint = "http://localhost:9103/intelliq_api/admin/healthcheck?format="+ format 
            response = requests.get(endpoint)
            if response.status_code == 200:
                if format == 'csv':
                    click.echo(response.text)
                elif format == 'json' or format =='':
                    # print JSON to terminal
                    click.echo(response.json())
                else:
                    click.echo(response.text)
            else:
                click.echo("Request failed with response :",response)
        else:
            click.echo("You dont have administrative Privilleges")
    else:
        click.echo("You have to login first.")




#Logout 
#CHECKED
@cli.command()
def logout():
    if os.path.exists("usr_details.json"):
        os.remove("usr_details.json")
    print("Logged Out")


# Reset all data
#CHECKED
@cli.command()
@click.option('--format', '-f', prompt=False, help='CSV or JSON.')
def resetall(format):
    if logged_in:
        if (mstatuss == 'a'):

            endpoint = "http://localhost:9103/intelliq_api/admin/resetall?format="+ format
            response = requests.post(endpoint,data ={'member_id': mmember_id})
            
            if response.status_code == 200:
                if format == 'csv':
                    click.echo(response.text)
                elif format == 'json' or format =='':
                    # print JSON to terminal
                    click.echo(response.json())
                else:
                    click.echo(response.text)
            else:
                click.echo("Request failed with response :",response)
        else:
            click.echo("You dont have administrative Privilleges")
    else:
        click.echo("You have to login first.")







# a) get all questions for specific questionnaire
#CHECKED
@cli.command()
@click.option('--questionnaire_id', '-qid', prompt=False, help='The Questionnaire ID.')
@click.option('--format', '-f', prompt=False, help='CSV or JSON.')
def questionnaire(questionnaire_id,format):
    if logged_in:
        endpoint = f"http://localhost:9103/intelliq_api/questionnaire/{questionnaire_id}?format="+ format
        response = requests.get(endpoint)
        #print(response)
        if response.status_code == 200:
            if format == 'csv':
                click.echo(response.text)
            elif format == 'json' or format =='':
                # print JSON to terminal
                click.echo(response.json())
            else:
                click.echo(response.text)
        else:
            click.echo("Request failed with response :",response)
    else:
        ("You have to login first.")



#Upload a Questionnaire
#CHECKED
@cli.command()
@click.option('--source', '-src', prompt=False)
def questionnaireupd(source):
    if logged_in:
        endpoint = f"http://localhost:9103/intelliq_api/admin/questionnaire_upd"
       
        path = '../data/questionnaires/'+source
       
        response = requests.post(endpoint,data ={'member_id': mmember_id} , files={'file': open(path, 'rb')})
        if response.status_code == 200:    
            click.echo("Questionnaire Uploaded !")
        else:
            click.echo("Request failed with JSON response :")
            click.echo(response.json())
            



#Get options of specific question for specific questionnaire
#CHECKED
@cli.command()
@click.option('--questionnaire_id', '-qrid', prompt=False, help='The Questionnaire ID.')
@click.option('--question_id', '-qnid', prompt=False, help='The Question ID.')
@click.option('--format', '-f', prompt=False, help='CSV or JSON.')
def question(questionnaire_id, question_id,format):
    if logged_in:
        endpoint = f"http://localhost:9103/intelliq_api/admin/question/{questionnaire_id}/{question_id}?format="+ format
        response = requests.get(endpoint)
        if response.status_code == 200:
            if format == 'csv':
                click.echo(response.text)
            elif format == 'json' or format =='':
                # print JSON to terminal
                click.echo(response.json())
            else:
                click.echo(response.text)
        else:
            click.echo("Request failed with response :",response)
    else:
        ("You have to login first.")




#c) post option to question for specific questionnaire and session


@cli.command()
@click.option('--questionnaire_id', '-qrid', prompt=False, help='The Questionnaire ID.')
@click.option('--question_id', '-qnid', prompt=False, help='The Question ID.')
@click.option('--session_id', '-sid', prompt=False, help='The Session ID.')
@click.option('--option_id', '-optid', prompt=False, help='The Option ID.')
def doanswer(questionnaire_id,question_id,session_id,option_id):
    if logged_in:
        #payload = {'username': username, 'password': passw}
        endpoint = f"http://localhost:9103/intelliq_api/doanswer/{questionnaire_id}/{question_id}/{session_id}/{option_id}"
        response = requests.post(endpoint)
        if response.status_code == 200:
            click.echo(response.text)
        else:
            click.echo(response.text)
    else:
        click.echo("You have to login first.")




# Get session answers of a questionnaire
# CHECKED
@cli.command()
@click.option('--questionnaire_id', '-qrid', prompt=False, help='The Questionnaire ID.')
@click.option('--session_id', '-sid', prompt=False, help='The Question ID.')
@click.option('--format', '-f', prompt=False, help='CSV or JSON.')
def getsessionanswers(questionnaire_id,session_id,format):
    if logged_in:
        endpoint = f"http://localhost:9103/intelliq_api/getsessionanswers/{questionnaire_id}/{session_id}?format="+ format
        response = requests.get(endpoint)
        if response.status_code == 200:
            if format == 'csv':
                click.echo(response.text)
            elif format == 'json' or format =='':
                # print JSON to terminal
                click.echo(response.json())
            else:
                click.echo(response.text)
        else:
            click.echo("Request failed with response :",response)
    else:
        ("You have to login first.")


#The answers of a specific question
#CHECKED
@cli.command()
@click.option('--questionnaire_id', '-qrid', prompt=False, help='The Questionnaire ID.')
@click.option('--question_id', '-qnid', prompt=False, help='The Question ID.')
@click.option('--format', '-f', prompt=False, help='CSV or JSON.') 
def getquestionanswers(questionnaire_id,question_id,format):
    if logged_in:
        endpoint = f"http://localhost:9103/intelliq_api/getquestionanswers/{questionnaire_id}/{question_id}?format="+ format
        response = requests.get(endpoint)
        if response.status_code == 200:
            if format == 'csv':
                click.echo(response.text)
            elif format == 'json' or format =='':
                # print JSON to terminal
                click.echo(response.json())
            else:
                click.echo(response.text)
        else:
            click.echo("Request failed with response :",response)
    else:
        ("You have to login first.")




#4. Reset all answers of a questionaire
#CHECKED
@cli.command()
@click.option('--questionnaire_id', '-qrid', prompt=False, help='The Questionnaire ID.')
@click.option('--format', '-f', prompt=False, help='CSV or JSON.')
def resetq(questionnaire_id,format):
    if logged_in:
        endpoint = f"http://localhost:9103/intelliq_api/admin/resetq/{questionnaire_id}?format="+ format
        response = requests.post(endpoint)
        if response.status_code == 200:
            if format == 'csv':
                click.echo(response.text)
            elif format == 'json' or format =='':
                # print JSON to terminal
                click.echo(response.json())
            else:
                click.echo(response.text)
        else:
            click.echo("Request failed with response :",response)
    else:
        ("You have to login first.")


#Add Admin main scope
@click.group()
@click.pass_context
def admin(ctx):
    if not ctx.invoked_subcommand:
        click.echo('Please specify a subcommand for the admin command.')


cli.add_command(admin)


#Admin Functions / Subscopes

#Admin usermod command
@admin.command()
@click.option('--username', '-u', required=True)
@click.option('--passw', '-p', required=True)
@click.option('--member_id', '-mid')
@click.option('--mstatus', '-s')
@click.option('--first_name', '-fn')
@click.option('--last_name', '-ln')
@click.option('--gender', '-s')
@click.option('--date_of_birth')
#@click.option('--format', '-f', prompt=False, help='CSV or JSON.')
def usermod(username, passw,member_id,mstatus,first_name,last_name,gender,date_of_birth):
    if logged_in:
        if (mstatuss == 'a'):
            dataa ={
                'member_id': member_id,
                'mstatus': mstatus,
                'First_Name': first_name,
                'Last_Name': last_name,
                'Gender': gender,
                'Date_of_Birth': date_of_birth
                }
            endpoint = f"http://localhost:9103/intelliq_api/admin/usermod/{username}/{passw}"
            response = requests.post(endpoint,data = dataa)
            if response.status_code == 200:
                    click.echo(response.text)
            else:
                click.echo("Request failed with response :",response)
        else:
             click.echo("You dont have administrative privileges.")
    else:
        click.echo("You have to login first.")




#Add users command
@admin.command()
@click.option('--username', '-u', required=True)
@click.option('--format', '-f', prompt=False, help='CSV or JSON.')
def users(username,format):
    if logged_in:
        if (mstatuss == 'a'):
            endpoint = f"http://localhost:9103/intelliq_api/admin/users/{username}?format="+ format
            response = requests.get(endpoint)
            if response.status_code == 200:
                if format == 'csv':
                    click.echo(response.text)
                elif format == 'json' or format =='':
                    # print JSON to terminal
                    click.echo(response.json())
                else:
                    click.echo(response.text)
            else:
                click.echo("Request failed with response :",response)
        else:
             click.echo("You dont have administrative privileges.")
    else:
        click.echo("You have to login first.")




if __name__ == '__main__':
    cli()
