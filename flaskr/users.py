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

    return render_template("user.html", user=user)


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

    return render_template("user.html", user=user)