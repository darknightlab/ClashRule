FROM python:3.6-alpine
WORKDIR /app
COPY requirements.txt Config clashrule.py ./
RUN pip install --no-cache -r requirements.txt && chmod +x /app/clashrule.py
ENTRYPOINT [ "/app/clashrule.py" ]
CMD [ "listen" ]