from dataclasses import dataclass
from typing import Optional


@dataclass
class Token:
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
