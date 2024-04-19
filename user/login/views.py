from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json


@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if email is None or password is None:
        return Response({'error': 'Vui lòng cung cấp email và mật khẩu'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(email=email, password=password)
    if not user:
        return Response({'error': 'Email hoặc mật khẩu không đúng'}, status=status.HTTP_401_UNAUTHORIZED)

    response = Response({'user_id': user.pk, 'is_staff': user.is_staff}, status=status.HTTP_200_OK)
    cookie_data = {'user_id': user.pk, 'is_staff': user.is_staff}
    cookie_string = json.dumps(cookie_data)
    response.set_cookie('user_info', cookie_string, httponly=True)
    return response
