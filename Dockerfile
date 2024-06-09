FROM python:3.10

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/


CMD ["python", "manage.py", "runserver"]

# Docker run command = docker run -p 8000:8000 ae8a548d2a7d (Imagecode)