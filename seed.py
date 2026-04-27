import os
import django
from datetime import timedelta
from django.utils.timezone import now

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from core.models import User, Project, Task

def run():
    print("Seeding database...")
    User.objects.all().delete()
    Project.objects.all().delete()
    Task.objects.all().delete()

    user1 = User.objects.create_user(
        email='test1@example.com',
        password='password123',
        first_name='Test',
        last_name='User1'
    )
    user2 = User.objects.create_user(
        email='test2@example.com',
        password='password123',
        first_name='Test',
        last_name='User2'
    )
    
    p1 = Project.objects.create(
        title="Website Redesign",
        description="Redesign the corporate website.",
        status="active",
        user=user1
    )
    p2 = Project.objects.create(
        title="Mobile App Launch",
        description="Launch the iOS app.",
        status="completed",
        user=user1
    )
    
    p3 = Project.objects.create(
        title="Marketing Campaign",
        description="Q4 Marketing Campaign setup.",
        status="active",
        user=user2
    )

    Task.objects.create(
        title="Design wireframes",
        description="Create wireframes for homepage.",
        status="done",
        due_date=now() - timedelta(days=5),
        project=p1
    )
    Task.objects.create(
        title="Implement frontend",
        description="Convert wireframes to HTML/CSS.",
        status="in-progress",
        due_date=now() + timedelta(days=3),
        project=p1
    )
    Task.objects.create(
        title="Test deployment",
        description="Perform UAT to staging server.",
        status="todo",
        due_date=now() + timedelta(days=10),
        project=p1
    )

    Task.objects.create(
        title="App Store submission",
        description="Submit to App Store review.",
        status="done",
        due_date=now() - timedelta(days=2),
        project=p2
    )

    print("Database seeded successfully.")
    print("Users available:")
    print("1. test1@example.com / password123")
    print("2. test2@example.com / password123")

if __name__ == '__main__':
    run()
