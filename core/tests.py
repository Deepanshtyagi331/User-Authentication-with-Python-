from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Project, Task

User = get_user_model()

class UserModelTest(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(email='test@test.com', password='password123')
        self.assertEqual(user.email, 'test@test.com')
        self.assertTrue(user.check_password('password123'))
        self.assertFalse(user.is_superuser)

class ProjectModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email='test@test.com', password='password123')
        self.project = Project.objects.create(title='Test Project', user=self.user)

    def test_project_creation(self):
        self.assertEqual(self.project.title, 'Test Project')
        self.assertEqual(self.project.status, 'active')
        self.assertEqual(self.project.user, self.user)


# Create your tests here.
