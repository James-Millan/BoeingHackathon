import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from flaskr.db import get_db

bp = Blueprint("users", __name__, url_prefix="/")

@bp.route("/user/id/<int:uid>")
def user_view_id(uid: int):
    db = get_db()
    error = None

    user = db.execute(
        'SELECT id, username, password, perms, content FROM Users WHERE id = ?', (uid,)
    ).fetchone()

    if user is None:
        error = "User doesn't exist!"
    
    if error is not None:
        flash(error)

    return render_template("users/user.html", user=user)


@bp.route("/user/<string:uname>")
def user_view_name(uname: str):
    db = get_db()
    error = None

    user = db.execute(
        'SELECT id, username, password, perms, content FROM Users WHERE username = ?', (uname,)
    ).fetchone()

    if user is None:
        error = "User doesn't exist!"
    
    if error is not None:
        flash(error)
    return render_template("users/user.html", user=user)


@bp.route("/user/edit", methods=("GET", "POST"))
def user_edit_view():
    user_id = session.get('user_id')

    if user_id is None:
        flash("Not logged in!")
        return render_template("index.html")

    if request.method == "GET":
        user = get_db().execute(
            'SELECT * FROM Users WHERE id = ?', (user_id,)
        ).fetchone()

        return render_template("users/edit.html", user=user)
    
    elif request.method == "POST":
        content = request.form['content']

        get_db().execute(
            "UPDATE Users SET content = ? WHERE id = ?", (content, user_id,)
        )

        user = get_db().execute(
            'SELECT * FROM Users WHERE id = ?', (user_id,)
        ).fetchone()

        return render_template("users/edit.html", user=user)

