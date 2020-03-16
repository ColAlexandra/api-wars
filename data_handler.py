import database_common


@database_common.connection_handler
def list_all_users(cursor):
    cursor.execute("""SELECT DISTINCT "user".user_name, "user".user_email, "user".reg_time, "user".user_image,
                    (SELECT COUNT(question.id) FROM question WHERE question.username="user".user_name) as question,
                    (SELECT COUNT(answer.id) FROM answer WHERE answer.username="user".user_name) as answer,
                    (SELECT COUNT("comment".id) FROM "comment" WHERE "comment".username="user".user_name) as "comment"
                    FROM "user"
                    LEFT JOIN question ON "user".user_name=question.username
                    LEFT JOIN answer ON "user".user_name=answer.username
                    LEFT JOIN "comment" ON "user".user_name="comment".username
                    WHERE "user".user_name=question.username AND "user".user_name=answer.username AND "user".user_name="comment".username
                    OR (question.username IS NULL) OR (answer.username IS NULL) OR ("comment".username IS NULL)
                    GROUP BY "user".user_name, question.id, answer.id, "comment".id""")
    return cursor.fetchall()


@database_common.connection_handler
def register_user(cursor, username, password):
    cursor.execute("""INSERT INTO users_table(username, password) VALUES (%(username)s, %(password)s)""",
                   {'username': username, 'password': password})


@database_common.connection_handler
def get_hashed_password(cursor, username):
    cursor.execute("""SELECT password FROM users_table WHERE username = %(username)s""", {'username': username})
    hashed_password = cursor.fetchone()
    return hashed_password['password']


@database_common.connection_handler
def username_exist(cursor, username):
    cursor.execute("""SELECT username from users_table""")
    list_of_users = [user['username'] for user in cursor.fetchall()]
    return username in list_of_users
