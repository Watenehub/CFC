from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class User:
    name: str
    email: str
    password: str
    role: str
    phone: str = ""
    status: str = "active"
    created_at: Optional[datetime] = None


@dataclass
class Event:
    title: str
    photo: str
    date: str
    time: str
    description: str
    location: str
    status: str = "draft"
    created_at: Optional[datetime] = None


@dataclass
class Sermon:
    title: str
    video_url: str
    speaker: str
    date: str
    description: str
    takeaways: str
    photo: str
    status: str = "draft"
    created_at: Optional[datetime] = None


@dataclass
class Giving:
    category: str
    description: str
    poster: str
    payment_method: str
    payment_details: str
    status: str = "draft"
    updated_at: Optional[datetime] = None


@dataclass
class Enquiry:
    name: str
    email: str
    phone: str
    subject: str
    message: str
    status: str = "New"
    response: str = ""
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


@dataclass
class Pastor:
    name: str
    photo: str
    title: str
    biography: str
    ministry_message: str
    status: str = "published"
    updated_at: Optional[datetime] = None


@dataclass
class Deacon:
    name: str
    photo: str
    role: str
    biography: str
    status: str = "published"
    updated_at: Optional[datetime] = None


@dataclass
class Ministry:
    name: str
    photo: str
    description: str
    leader: str
    meeting_information: str
    status: str = "published"
    updated_at: Optional[datetime] = None


@dataclass
class Service:
    name: str
    description: str
    day: str
    time: str
    photo: str
    status: str = "published"
    updated_at: Optional[datetime] = None


@dataclass
class Notification:
    recipient: str
    title: str
    message: str
    type: str
    is_read: bool = False
    created_at: Optional[datetime] = None