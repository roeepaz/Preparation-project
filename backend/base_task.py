from pydantic import BaseModel
from importance_level import Importance


class Task(BaseModel):
    id: int
    name: str
    description: str
    is_done: bool
    importance: Importance
    estimated_end_time: str
