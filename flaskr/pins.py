import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from werkzeug.security import check_password_hash, generate_password_hash

from flaskr.db import get_db

bp = Blueprint("pins", __name__, url_prefix="/pin")


@bp.route("/<int:pid>")
def pin_read(pid: int):
    db = get_db()
    error = None

    pin = db.execute(
        'SELECT id, userID, long, lat, pinName FROM Pins WHERE id = ?', (pid,)
    ).fetchone()

    if pin is None:
        error = "Pin doesn't exist!"
    
    if error is not None:
        flash(error)

    return render_template("pins/pin.html", pin=pin)


@bp.route("/add", methods=("GET", "POST"))
def pin_add():
    user_id = session.get('user_id')

    if user_id is None:
        flash("Not logged in!")
        return redirect(url_for("auth.login"))

    if request.method == 'POST':
        error = None

        longitude = request.form['long']
        latitude = request.form['lat']
        pin_name = request.form['Name']
        desc = request.form['desc']

        if not longitude:
            error = "Longitude is required!"
        if not latitude:
            error = "Latitude is required!"
        if not pin_name:
            error = "Pin name is required!"
        if not desc:
            desc = ""
        if error is None:
            try:
                db = get_db()

                longitude = float(longitude)
                latitude = float(latitude)

                if longitude > 180:
                    longitude = 180
                elif longitude < -180:
                    longitude = -180
                if latitude > 90:
                    latitude = 90
                elif latitude < -90:
                    latitude = -90
                
                db.execute(
                    "INSERT INTO Pins (userID, long, lat, pinName) VALUES (?, ?, ?, ?)",
                    (user_id, longitude, latitude, pin_name,),
                )
                db.commit()
                pin = db.execute(
                    "SELECT id FROM Pins WHERE pinName = ? AND userID = ?",
                    (pin_name, user_id)
                ).fetchone()
                print(pin)
                pid = int(pin['id'])
                db.execute(
                    "INSERT INTO Contributions (userID, pinID, content) VALUES (?, ?, ?)",
                    (user_id, pid, desc)
                )
            except TypeError as e:
                print(e)
                error = "These coordinates aren't numbers!!!"
        
        if error is not None:
            flash(error)

    # can just have a popup that says pin added successfully
    return render_template("pins/add.html")


@bp.route("/get-all")
def get_all():
    db = get_db()
    pins = db.execute(
        'SELECT * FROM Pins'
    ).fetchall()
    out = {"result": []}
    for pin in pins:
        out["result"].append({field: value for field, value in zip(pin.keys(), pin)})
    return out

@bp.route("/get", methods=["GET", "POST"])
def get_single(lat, long):
    db = get_db()
    pins = db.execute(
        "SELECT * FROM pins WHERE long = ? AND lat = ?", (lat, long)
    ).fetchall()
    return "test"





