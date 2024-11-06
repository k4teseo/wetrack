# auth_app/middleware.py
from django.middleware.csrf import CsrfViewMiddleware
from django.conf import settings

class CustomCsrfMiddleware(CsrfViewMiddleware):
    def process_view(self, request, callback, callback_args, callback_kwargs):
        # Check if the path should be exempted
        path = request.path_info.lstrip('/')
        if any(path.startswith(url) for url in getattr(settings, 'CSRF_EXEMPT_URLS', [])):
            return None
        return super().process_view(request, callback, callback_args, callback_kwargs)