import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from flaskr.db import get_db

bp = Blueprint("users", __name__, url_prefix="/")


@bp.route("/user")
@bp.route("/user/")
def user_view():
    user_id = session.get('user_id')

    if user_id is None:
        flash("Not logged in!")
        return redirect(url_for("auth.login"))
    
    return redirect(url_for("users.user_view_id", uid=user_id))


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

    pins = db.execute(
        'SELECT * FROM Pins WHERE userID = ?', (uid,)
    ).fetchall()

    return render_template("users/user.html", user=user, pins=pins)


@bp.route("/user/<string:uname>")
def user_view_name(uname: str):
    db = get_db()
    error = None

    user = db.execute(
        'SELECT id, username, password, perms, content FROM Users WHERE username = ?', (uname,)
    ).fetchone()

    uid = user["id"]

    if user is None:
        error = "User doesn't exist!"
    
    pins = db.execute(
        'SELECT * FROM Pins WHERE userID = ?', (uid,)
    ).fetchall()

    return render_template("users/user.html", user=user, pins=pins)


@bp.route("/user/edit", methods=("GET", "POST"))
def user_edit():
    user_id = session.get('user_id')

    if user_id is None:
        flash("Not logged in!")
        return render_template("index.html")
    
    db = get_db()

    if request.method == "GET":
        user = db.execute(
            'SELECT * FROM Users WHERE id = ?', (user_id,)
        ).fetchone()

        return render_template("users/edit.html", user=user)
    
    elif request.method == "POST":
        content = request.form['content']

        db.execute(
            "UPDATE Users SET content = ? WHERE id = ?", (content, user_id,)
        )
        db.commit()

        user = db.execute(
            'SELECT id, username, perms, content FROM Users WHERE id = ?', (user_id,)
        ).fetchone()

        flash("Successful edit!")
        return render_template("users/edit.html", user=user)

