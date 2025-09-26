# cadastro/current_user.py
import threading

_thread_locals = threading.local()

def set_current_user(user):
    _thread_locals.user = user

def get_current_user():
    return getattr(_thread_locals, "user", None)

def set_current_request(request):
    _thread_locals.request = request

def get_current_request():
    return getattr(_thread_locals, "request", None)
