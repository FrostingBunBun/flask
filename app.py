from flask import Flask
from views import views
from flask_login import LoginManager, UserMixin
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.register_blueprint(views, url_prefix="/")

if __name__ == "__main__":
    app.run(debug=True, port=8000)
