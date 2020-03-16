from flask import Flask, render_template, redirect, request, session
import requests
import data_handler
import os
import password_verification
import psycopg2

app = Flask(__name__)
app.secret_key = os.urandom(24)


@app.route('/')
def home():
    user = None
    if 'user' in session:
        user = session['user']
    headers = ['NAME', 'DIAMETER (km)', 'CLIMATE', 'TERRAIN', 'SURFACE WATER (%)', 'POPULATION', 'RESIDENTS', 'VOTE']
    modal_headers = ['NAME', 'HEIGHT', 'MASS', 'SKIN COLOR', 'HAIR COLOR', 'EYE COLOR', 'BIRTH YEAR', 'GENDER']
    data_source = 'https://swapi.co/api/planets'
    table_data = requests.get(data_source).json()
    return render_template('trial.html',
                           headers=headers,
                           modal_headers=modal_headers,
                           table_data=table_data['results'],
                           user=user)


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('register.html')
    if request.method == 'POST':
        username = request.form['username']
        print(username)
        password = request.form['password']
        print(password)
        password2 = request.form['confirm']
        print(password2)

        if data_handler.username_exist(username):
            return render_template('register.html', message="The username already exist")
        if password != password2:
            return render_template('register.html', message='Two passwords don\'t match each other')
        else:
            hash_password = password_verification.hash_password(password)
            data_handler.register_user(username, hash_password)
            return redirect('/')


@app.route('/login', methods=['GET', 'POST'])
def login(invalid_login=False):
    if request.method == 'GET':
        return render_template('login.html', invalid_login=invalid_login)
    elif request.method == 'POST':
        username = request.form['username']
        text_password = request.form['password']

        if data_handler.username_exist(username):
            hashed_password = data_handler.get_hashed_password(username)
            if password_verification.verify_password(text_password, hashed_password):
                session['user'] = username
                return redirect('/')
        else:
            return render_template('login.html', message='Incorrect login or password, try again', invalid_login=True)


@app.route('/logout')
def logout():
    if 'user' in session:
        session.pop('user', None)
        return redirect('/')


if __name__ == '__main__':
    app.run(
        debug=True,
    )