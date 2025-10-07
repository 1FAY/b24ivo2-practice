FROM python:3.11-slim

WORKDIR /app
COPY app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ /app/
ENV FLASK_APP=app.py FLASK_RUN_HOST=0.0.0.0 FLASK_RUN_PORT=5000
EXPOSE 5000
CMD ["flask", "run"]
