import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from posts.cache_utils import ALL_KEY, ONE_KEY, key_exists

@pytest.fixture
def client():
    return APIClient()

@pytest.fixture
def user(db):
    User = get_user_model()
    return User.objects.create_user(
        username="u1",
        email="u1@example.com",
        password="pass12345",
        full_name="Unit Test User",
    )

@pytest.fixture
def auth_client(client, user):
    # login via JWT by username
    url = reverse("login")
    res = client.post(url, {"username": user.username, "password": "pass12345"}, format="json")
    assert res.status_code == 200
    token = res.data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return client

def test_register(client, db):
    url = reverse("register")
    res = client.post(
        url,
        {
            "username": "john",
            "full_name": "John Doe",
            "email": "j@e.com",
            "password": "pass12345",
        },
        format="json",
    )
    assert res.status_code == 201
    assert "id" in res.data

def test_posts_requires_auth(client):
    # list
    res = client.get(reverse("posts"))
    assert res.status_code in (401, 403)
    # create
    res = client.post(reverse("posts"), {"title": "t1", "content": "c1"}, format="json")
    assert res.status_code in (401, 403)
    # retrieve
    res = client.get(reverse("post-detail", args=[123]))
    assert res.status_code in (401, 403)

def test_create_list_retrieve_with_cache(auth_client, db):
    # No cache key initially
    assert not key_exists(ALL_KEY)

    # create first post
    r1 = auth_client.post(reverse("posts"), {"title": "t1", "content": "c1"}, format="json")
    assert r1.status_code == 201
    pid = r1.data["id"]

    # list builds cache
    rlist1 = auth_client.get(reverse("posts"))
    assert rlist1.status_code == 200
    assert any(p["id"] == pid for p in rlist1.json())
    assert key_exists(ALL_KEY)

    # retrieve by id builds per-id cache
    rget1 = auth_client.get(reverse("post-detail", args=[pid]))
    assert rget1.status_code == 200
    assert rget1.json()["id"] == pid

def test_invalidate_list_cache_on_create(auth_client, db):
    # Seed and cache list
    r1 = auth_client.post(reverse("posts"), {"title": "t1", "content": "c1"}, format="json")
    assert r1.status_code == 201
    _ = auth_client.get(reverse("posts"))
    assert key_exists(ALL_KEY)

    # Creating a new post should invalidate list cache
    r2 = auth_client.post(reverse("posts"), {"title": "t2", "content": "c2"}, format="json")
    assert r2.status_code == 201
    assert not key_exists(ALL_KEY)


def test_get_nonexistent_post_returns_404(auth_client, db):
    # Trying to fetch a non-existent post should return 404
    res = auth_client.get(reverse("post-detail", args=[999999]))
    assert res.status_code == 404


def test_login_wrong_password(client, user):
    url = reverse("login")
    # Login attempt with wrong password should return 400 or 401
    res = client.post(url, {"username": user.username, "password": "wrong"}, format="json")
    assert res.status_code in (400, 401)
