import click
import requests
import json 
import os


logged_in = False
mstatus = 0

if os.path.exists("usr_details.json"):
    with open("usr_details.json", "r") as f:
        data = json.load(f)
        mstatus = int(data[0]["mstatus"])


if mstatus == 1:
    logged_in = True


@click.group()
def cli():
    pass


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
    #print(response.json())


@cli.command()
def healthcheck():
    if logged_in:
        if (mstatus == 1):
            endpoint = "http://localhost:9103/intelliq_api/admin/healthcheck" 
            response = requests.get(endpoint)
            if response.status_code == 200:
                click.echo(response.json())
        else:
            click.echo("You dont have administrative Privilleges")
    else:
        click.echo("You have to login first.")


@cli.command()
def logout():
    if os.path.exists("usr_details.json"):
        os.remove("usr_details.json")
    print("Logged Out")


@cli.command()
def resetall():
    if logged_in:
        if (mstatus == 1):
            endpoint = "http://localhost:9103/intelliq_api/admin/resetall" 
            response = requests.get(endpoint)
            if response.status_code == 200:
                click.echo(response.json())
            else:
                click.echo("Request failed")
        else:
            click.echo("You dont have administrative Privilleges")
    else:
        click.echo("You have to login first.")






#
@cli.command()
@click.option('--questionnaire_id', '-qid', prompt=False, help='The Questionnaire ID.')
def questionnaire(questionnaire_id):
    if logged_in:
        endpoint = f"http://localhost:9103/intelliq_api/admin/questionnaire/{questionnaire_id}"
        response = requests.get(endpoint)
        if response.status_code == 200:
                click.echo(response.json())
        else:
            click.echo("Request failed")


@cli.command()
@click.option('--source', '-src', prompt=False, help='The Questionnaire ID.')
def questionnaire_upd(source):
    if logged_in:
        endpoint = f"http://localhost:9103/intelliq_api/admin/questionnaire_upd"
        response = requests.post(endpoint)
        if response.status_code == 200:
                click.echo(response.json())
        else:
            click.echo("Request failed")




@cli.command()
@click.option('--questionnaire_id', '-qrid', prompt=False, help='The Questionnaire ID.')
@click.option('--question_id', '-qnid', prompt=False, help='The Question ID.')
def question(questionnaire_id, question_id):
    if logged_in:
        endpoint = f"http://localhost:9103/intelliq_api/admin/question/{questionnaire_id}/{question_id}"
        response = requests.get(endpoint)
        if response.status_code == 200:
                click.echo(response.json())
        else:
            click.echo("Request failed")
    else:
        click.echo("You have to login first.")



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
    else:
        click.echo("You have to login first.")


'''
@cli.command()
@click.option('--questionnaire_id', '-qrid', prompt=False, help='The Questionnaire ID.')
@click.option('--question_id', '-qnid', prompt=False, help='The Question ID.')
def getsessionanswers(questionnaire_id,question_id)
    if logged_in:
        endpoint = f"http://localhost:3000/admin/question/{question_id}"
        response = requests.get(endpoint)
        if response.status_code == 200:
                click.echo(response.json())
        else:
            click.echo("Request failed")
    else:
        click.echo("You have to login first.")

'''

@cli.command()
@click.option('--questionnaire_id', '-qrid', prompt=False, help='The Questionnaire ID.')
@click.option('--question_id', '-qnid', prompt=False, help='The Question ID.')
def getquestionanswers(questionnaire_id,question_id):
    if logged_in:
        endpoint = f"http://localhost:9103/intelliq_api/getquestionanswers/{questionnaire_id}/{question_id}"
        response = requests.get(endpoint)
        if response.status_code == 200:
                click.echo(response.json())
        else:
            click.echo("Request failed")
    else:
        click.echo("You have to login first.")


@cli.command()
@click.option('--questionnaire_id', '-qrid', prompt=False, help='The Questionnaire ID.')
def resetq(questionnaire_id):
    if logged_in:
        endpoint = f"http://localhost:9103/intelliq_api/admin/resetq/{questionnaire_id}"
        response = requests.post(endpoint)
        if response.status_code == 200:
                click.echo(response.json())
        else:
            click.echo("Request failed")
    else:
        click.echo("You have to login first.")


if __name__ == '__main__':
    cli()
