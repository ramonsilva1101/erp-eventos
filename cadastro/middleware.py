import threading

_user = threading.local()

def get_current_user():
    return getattr(_user, "user", None)

def get_current_request():
    return getattr(_user, "request", None)

class CurrentUserMiddleware:
    """
    Middleware que armazena usuário, ip e user-agent do request atual.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        _user.user = getattr(request, "user", None)
        _user.request = request

        response = self.get_response(request)

        _user.user = None
        _user.request = None

        return response

def get_client_ip():
    request = get_current_request()
    if not request:
        return None
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0]
    return request.META.get("REMOTE_ADDR")

def get_user_agent():
    request = get_current_request()
    if not request:
        return None
    return request.META.get("HTTP_USER_AGENT")
