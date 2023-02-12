import click
import requests

logged_in = False
mstatus = 0

@click.group()
def cli():
    pass


@cli.command()
@click.option('--username', '-u', prompt=False, help='Username for login.')
@click.option('--passw', '-p', prompt=False, hide_input=True, confirmation_prompt=True, help='Password for login.')
def login(username, passw):
    global logged_in
    payload = {'email': username, 'password': passw}
    endpoint = "http://localhost:3000/login"
    response = requests.post(endpoint, json=payload)
    if response.status_code == 200:
        click.echo('Logged in Successfully.')
        logged_in = True
        global mstatus
        mstatus = response.json().get('mstatus')
    else:
        click.echo('Incorrect user details. Try again.')


@cli.command()
def healthcheck():
    if logged_in:
        if (mstatus == 1):
            endpoint = "http://localhost:3000/admin/healthcheck" 
            response = requests.get(endpoint)
            click.echo(response.json())
        else:
            click.echo("You dont have administrative Privilleges")
    else:
        click.echo("You have to login first.")


@cli.command()
def resetall():
    if logged_in:
        if (mstatus == 1):
            endpoint = "http://localhost:3000/admin/resetall" 
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
        endpoint = f"http://localhost:3000/admin/questionnaire/{questionnaire_id}"
        response = requests.get(endpoint)
        if response.status_code == 200:
                click.echo(response.json())
        else:
            click.echo("Request failed")


@cli.command()
@click.option('--source', '-src', prompt=False, help='The Questionnaire ID.')
def questionnaire_upd(source):




@cli.command()
@click.option('--questionnaire_id', '-qrid', prompt=False, help='The Questionnaire ID.')
@click.option('--question_id', '-qnid', prompt=False, help='The Question ID.')
def question(question_id):
    if logged_in:
        endpoint = f"http://localhost:3000/admin/question/{question_id}"
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
    
    else:
        click.echo("You have to login first.")



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



@cli.command()
@click.option('--questionnaire_id', '-qrid', prompt=False, help='The Questionnaire ID.')
@click.option('--question_id', '-qnid', prompt=False, help='The Question ID.')
def getquestionanswers(questionnaire_id,question_id)
    if logged_in:
        endpoint = f"http://localhost:3000/admin/question/{question_id}"
        response = requests.get(endpoint)
        if response.status_code == 200:
                click.echo(response.json())
        else:
            click.echo("Request failed")
    else:
        click.echo("You have to login first.")



while True:
    try:
        cli()
    except SystemExit:
        pass